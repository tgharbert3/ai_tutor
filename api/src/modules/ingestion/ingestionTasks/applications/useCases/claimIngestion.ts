import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";

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
    async execute(taskId: string) {
        const task = await this.ingestionTasks.claimIngestionTask(taskId);
        if (!task || !task.taskId) {
            throw new TaskNotClaimable("Task must exist to process");
        }
        return task;
    }
}