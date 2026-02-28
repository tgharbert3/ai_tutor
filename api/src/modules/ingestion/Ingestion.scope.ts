import type { QueueOptions } from "bullmq";

import type { CanvasApiPort, CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { JWTData } from "@/lib/types.js";

import { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";
import { SyncUserUseCase } from "@/modules/users/applications/useCases/syncUser.useCase.js";

import type { AppQueues, AppRepos } from "../../app/composition/types.js";

export class IngestionScope {
    public readonly canvas: CanvasApiPort;
    constructor(
        private readonly ctx: JWTData,
        private readonly repos: AppRepos,
        private readonly queues: AppQueues,
        private readonly redis: QueueOptions,
        private readonly canvasFactory: CanvasApiPortFactory,
    ) {
        // this.canvas = this.canvasFactory.create({ apiToken: this.ctx.apiToken, canvasBaseUrl: this.ctx.canvasBaseUrl });
        this.canvas = new CanvasClient(this.ctx.canvasToken, this.ctx.canvasBaseUrl);
    };

    async execute() {
        const syncUser = new SyncUserUseCase({
            schoolRepo: this.repos.schools,
            userRepo: this.repos.users,
            canvasClient: this.canvas,
            userId: this.ctx.userId,
            email: this.ctx.email,
            canvasBaseUrl: this.ctx.canvasBaseUrl,
            ingestionRunRepo: this.repos.ingestionRuns,
        });
        const handoff = await syncUser.execute();
        // TODO: Catch any enrollment queue erros
        // await this.queues.enrollmentQueue.enqueueEnrollmentFlow({
        //     ingestionId: handoff.ingestionId,
        //     userId: handoff.userId,
        //     schoolId: handoff.schoolId,
        // });

        return { ingestionId: handoff.ingestionId, status: handoff.status };
    }
}