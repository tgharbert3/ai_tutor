import { FetchUsersCanvasEnrollmentsUseCase } from "@/infrastructure/canvas/applications/fetchUsersCanvasEnrollmets.useCase.js";
import { FetchUsersCanvasTokenUseCase } from "@/infrastructure/internal/application/fetchUsersCanvasToken.useCase.js";
import { getDroppedEnrollments } from "@/modules/enrollments/application/diffEnrollments.js";
import { FetchUsersLocalEnrollmentsUseCase } from "@/modules/enrollments/application/fetchLocalEnrollments.useCase.js";
import { SetEnrollmentsToFalseUseCase } from "@/modules/enrollments/application/setEnrollmentsToFalse.useCase.js";
import { UpdateIngestionRunStatusUseCase } from "@/modules/ingestionRuns/application/updateStatus.useCase.js";

import type { SyncUserEnrollmentsUseCaseDeps } from "../domain/types.js";

export class SyncUserEnrollmentsUseCase {
    private readonly updateStatusUC: UpdateIngestionRunStatusUseCase;
    private readonly fetchCanvasTokenUC: FetchUsersCanvasTokenUseCase;
    private readonly fetchEnrollmentsUC: FetchUsersCanvasEnrollmentsUseCase;
    private readonly fetchLocalEnrollmentsUC: FetchUsersLocalEnrollmentsUseCase;
    private readonly setEnrollmentsToFalseUC: SetEnrollmentsToFalseUseCase;
    constructor(
        private readonly syncUserEnrollmentDeps: SyncUserEnrollmentsUseCaseDeps,
    ) {
        this.updateStatusUC = new UpdateIngestionRunStatusUseCase(this.syncUserEnrollmentDeps.ingestionRunsRepo);
        this.fetchCanvasTokenUC = new FetchUsersCanvasTokenUseCase(this.syncUserEnrollmentDeps.clientFactory);
        this.fetchEnrollmentsUC = new FetchUsersCanvasEnrollmentsUseCase(this.syncUserEnrollmentDeps.canvasFactory);
        this.fetchLocalEnrollmentsUC = new FetchUsersLocalEnrollmentsUseCase(this.syncUserEnrollmentDeps.enrollmentsRepo);
        this.setEnrollmentsToFalseUC = new SetEnrollmentsToFalseUseCase(this.syncUserEnrollmentDeps.enrollmentsRepo);
    };

    // Possibly wrap in try catch or result pattern to be able to update to failed if the job fails
    async execute(): Promise<number[]> {
        const { ingestionId, userId, canvasBaseUrl } = this.syncUserEnrollmentDeps.jobData;
        // Update the ingestion run status
        await this.updateStatusUC.execute(ingestionId, "running");

        // Fetch the canvas token for the user from our auth server
        const canvasToken = await this.fetchCanvasTokenUC.execute(userId);

        // Get the canvas and local enrollments
        const usersCanvasEnrollments = await this.fetchEnrollmentsUC.execute(canvasToken, canvasBaseUrl);
        // the number array is the canvas courseIds in the local enrollments table
        const localEnrollments = await this.fetchLocalEnrollmentsUC.execute(userId);

        // Make a set of canvas course ids and a set of local enrollment course Ids
        // Sets offer faster lookups than array
        const canvasEnrollmentSet = new Set<number>(
            usersCanvasEnrollments.map(e => e.courseId),
        );
        const localEnrollmentSet = new Set(localEnrollments);

        // Calculate the dropped courses and set them to false in the userEnrollments table
        const dropped = getDroppedEnrollments(canvasEnrollmentSet, localEnrollmentSet);
        await this.setEnrollmentsToFalseUC.execute(userId, Array.from(dropped));

        // Extract just the course Ids an return to start the next step in the FP
        const canvasCourseIds = usersCanvasEnrollments.map(element => element.courseId);
        return canvasCourseIds;
    }
}