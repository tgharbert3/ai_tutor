import type { QueueOptions } from "bullmq";

import { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";
import { SyncUserUseCase } from "@/modules/users/applications/useCases/syncUser.useCase.js";

import type { AppQueues, AppRepos, Context } from "../../app/composition/types.js";

import { startWorkers } from "../background/workers/index.js";

export class IngestionScope {
    public readonly canvas: CanvasClient;
    constructor(
        private readonly ctx: Context,
        private readonly repos: AppRepos,
        private readonly queues: AppQueues,
        private readonly redis: QueueOptions,
    ) {
        this.canvas = new CanvasClient(this.ctx.apiToken, this.ctx.canvasBaseUrl);
    };

    async execute() {
        const syncUser = new SyncUserUseCase({
            schoolRepo: this.repos.schools,
            userRepo: this.repos.users,
            canvasClient: this.canvas,
            userId: this.ctx.userId,
            email: this.ctx.email,
            canvasBaseUrl: this.ctx.canvasBaseUrl,
            ingestionRunRepo: this.repos.ingestionRun,
        });
        const handoff = await syncUser.execute();
        // TODO: Catch any enrollment queue erros
        await this.queues.enrollmentQueue.enqueueEnrollmentFlow({
            ingestionId: handoff.ingestionId,
            userId: handoff.userId,
            schoolId: handoff.schoolId,
        });

        return { ingestionId: handoff.ingestionId, status: handoff.status };
    }

    startWorkers() {
        const workers = startWorkers(this.redis);
    }
}