import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";

import type { IngestionTask } from "../../domain/types.js";

import { TaskNotClaimable } from "../../domain/errors/errorsTypes.js";

export class ClaimIngestionTask {
    constructor(
        private readonly ingestionTasks: IIngestionTaskRepository,
    ) {}

    /**
     * Function to claim queued task from db
     * @param taskId task to claim
     * @returns task<IngestionTask>
     * @throws TaskNotClaimable
     */
    async execute(taskId: string): Promise<IngestionTask | null> {
        const task = await this.ingestionTasks.claimIngestionTask(taskId);
        if (!task) {
            return null;
        }

        if (task.status !== "running") {
            throw new TaskNotClaimable("Claimed Task must be running");
        }
        return task;
    }
}