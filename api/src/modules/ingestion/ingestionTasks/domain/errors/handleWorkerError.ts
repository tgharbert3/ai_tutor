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

        case "retry": {
            try {
                await job.retry("failed", {
                    resetAttemptsMade: true,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`failed ${job.id} on retry. discarding`);
                    await ingestionTasks.updateTaskStatusWithError("failed", taskId, error.message);
                }
                else {
                    throw error;
                }
            }
            break;
        }
        case "noop": {
            await job.log(`noop for job${job.id}`);
            await ingestionTasks.updateTaskStatus("noop", taskId);
            break;
        }
        case "bug":
        default:
            throw error;
    }
}