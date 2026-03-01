import type { CanvasApiPort, CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { JWTData } from "@/lib/types.js";

import { SyncUserUseCase } from "@/modules/users/applications/useCases/syncUser.useCase.js";

import type { AppQueues, AppRepos } from "../../app/composition/types.js";

export class PreIngestionScope {
    private syncUserUC: SyncUserUseCase;
    public readonly canvas: CanvasApiPort;
    constructor(
        private readonly ctx: JWTData,
        private readonly repos: AppRepos,
        private readonly queues: AppQueues,
        private readonly canvasFactory: CanvasApiPortFactory,
    ) {
        this.canvas = this.canvasFactory.create({ apiToken: this.ctx.canvasToken, canvasBaseUrl: this.ctx.canvasBaseUrl });
        this.syncUserUC = new SyncUserUseCase({
            schoolRepo: this.repos.schools,
            userRepo: this.repos.users,
            canvasClient: this.canvas,
            userId: this.ctx.userId,
            email: this.ctx.email,
            canvasBaseUrl: this.ctx.canvasBaseUrl,
            ingestionRunRepo: this.repos.ingestionRuns,
        });
    };

    async execute() {
        const handoff = await this.syncUserUC.execute();
        // TODO: Catch any enrollment queue errors
        await this.queues.enrollmentQueue.enqueueEnrollmentFlow({
            ingestionId: handoff.ingestionId,
            userId: handoff.userId,
            canvasBaseUrl: this.ctx.canvasBaseUrl,
        });

        return { ingestionId: handoff.ingestionId, status: handoff.status };
    }
}