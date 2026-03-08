import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";

export class MarkTaskAsSuccess {
    constructor(
        private readonly ingestionTasks: IIngestionTaskRepository,
    ) {};

    async execute(taskId: string) {
        return await this.ingestionTasks.updateTaskStatus("success", taskId);
    };
}