import { FetchUsersCanvasEnrollmentsUseCase } from "@/infrastructure/canvas/applications/fetchUsersCanvasEnrollmets.useCase.js";
import { FetchUsersCanvasToken } from "@/infrastructure/internal/application/fetchUsersCanvasToken.useCase.js";
import { getDroppedEnrollments } from "@/modules/ingestion/enrollments/application/diffEnrollments.js";
import { FetchUsersLocalEnrollmentsUseCase } from "@/modules/ingestion/enrollments/application/fetchLocalEnrollments.useCase.js";
import { SetEnrollmentsToFalseUseCase } from "@/modules/ingestion/enrollments/application/setEnrollmentsToFalse.useCase.js";
import { UpdateIngestionRunStatusUseCase } from "@/modules/ingestion/ingestionRuns/application/updateStatus.useCase.js";

import type { SyncUserEnrollmentsUseCaseDeps } from "../domain/types.js";

export class SyncUserEnrollmentsUseCase {
    private readonly updateStatusUC: UpdateIngestionRunStatusUseCase;
    private readonly fetchCanvasTokenUC: FetchUsersCanvasToken;
    private readonly fetchEnrollmentsUC: FetchUsersCanvasEnrollmentsUseCase;
    private readonly fetchLocalEnrollmentsUC: FetchUsersLocalEnrollmentsUseCase;
    private readonly setEnrollmentsToFalseUC: SetEnrollmentsToFalseUseCase;
    constructor(
        private readonly syncUserEnrollmentDeps: SyncUserEnrollmentsUseCaseDeps,
    ) {
        this.updateStatusUC = new UpdateIngestionRunStatusUseCase(this.syncUserEnrollmentDeps.ingestionRunsRepo);
        this.fetchCanvasTokenUC = new FetchUsersCanvasToken(this.syncUserEnrollmentDeps.clientFactory);
        this.fetchEnrollmentsUC = new FetchUsersCanvasEnrollmentsUseCase(this.syncUserEnrollmentDeps.canvasFactory);
        this.fetchLocalEnrollmentsUC = new FetchUsersLocalEnrollmentsUseCase(this.syncUserEnrollmentDeps.enrollmentsRepo);
        this.setEnrollmentsToFalseUC = new SetEnrollmentsToFalseUseCase(this.syncUserEnrollmentDeps.enrollmentsRepo);
    };

    // TODO: Possibly wrap in try catch or result pattern to be able to update to failed if the job fails
    async execute() {
        const { ingestionRunId, userId, canvasBaseUrl, schoolId } = this.syncUserEnrollmentDeps.job.data;
        // Update the ingestion run status
        await this.updateStatusUC.execute(ingestionRunId, "running");

        // Fetch the canvas token for the user from our auth server
        const canvasToken = await this.fetchCanvasTokenUC.execute(userId);

        // Get the canvas and local enrollments
        const usersCanvasEnrollments = await this.fetchEnrollmentsUC.execute(canvasToken, canvasBaseUrl);
        // the number array is the canvas courseIds in the local enrollments table
        const localEnrollments = await this.fetchLocalEnrollmentsUC.execute(userId);

        // Make a set of canvas course ids and a set of local enrollment course Ids
        // Sets offer faster lookups than array
        const canvasEnrollmentSet = new Set<number>(
            usersCanvasEnrollments.map(e => e.course_id),
        );
        const localEnrollmentSet = new Set<number>(localEnrollments);

        // Calculate the dropped courses and set them to false in the userEnrollments table
        const dropped = getDroppedEnrollments(canvasEnrollmentSet, localEnrollmentSet);
        await this.setEnrollmentsToFalseUC.execute(userId, Array.from(dropped));

        const canvasCourseIds = usersCanvasEnrollments.map(element => element.course_id);

        // Insert new course plan tasks so the course workers can pick them up
        const taskIds = await this.syncUserEnrollmentDeps.ingestionTasksRepo.insertCoursePlansFromArray(ingestionRunId, canvasCourseIds, schoolId);
        await Promise.all(
            taskIds.map(taskId => this.syncUserEnrollmentDeps.coursesQueue.add("course_plan", { ingestionRunId, taskId })),
        );

        // TODO: Update this to use the task table
        await this.syncUserEnrollmentDeps.job.updateProgress(100);
        return { ingestionRunId, taskId: taskIds[0] };
    }
}