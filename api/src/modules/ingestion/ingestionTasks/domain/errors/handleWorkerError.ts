import type { Job } from "bullmq";

import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";

import { classifyWorkerError } from "./classifyWorkerErrors.js";

export async function handleWorkerError(error: unknown, job: Job, ingestionTasks: IIngestionTaskRepository, taskId: string) {
    const action = classifyWorkerError(error);
    // TODO:figure out how to update the status for the task

    switch (action) {
        case "failed":
            await job.log(`discarding job${job.id} due non-retryable error`);
            await ingestionTasks.updateTaskStatus("failed", taskId);
            break;

        case "retry":
            throw error;

        case "bug":
        default:
            throw error;
    }
}