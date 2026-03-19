import type { Job, Queue } from "bullmq";

import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";

import { classifyWorkerError } from "./classifyWorkerErrors.js";

export async function handleWorkerError(error: unknown, job: Job, ingestionTasks: IIngestionTaskRepository, checkRunCompletion: Queue, taskId: string) {
    const action = classifyWorkerError(error);
    // TODO:figure out how to update the status for the task

    switch (action) {
        case "failed":
            await job.log(`discarding job${job.id} due non-retryable error`);
            await ingestionTasks.updateTaskStatus("failed", taskId);
            await checkRunCompletion.add("check", { ingestionRunId: job.data.ingestionRunId });
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
                    await checkRunCompletion.add("check", { ingestionRunId: job.data.ingestionRunId });
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
            await checkRunCompletion.add("check", { ingestionRunId: job.data.ingestionRunId });
            break;
        }
        case "bug":
        default:
            throw error;
    }
}