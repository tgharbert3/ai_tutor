import type { Worker } from "bullmq";

import { createWorker } from "@/modules/ingestion/background/factories/worker.factory.js";
import { handleWorkerError } from "@/modules/ingestion/ingestionTasks/domain/errors/handleWorkerError.js";

import type { buildWorkerContainer } from "./buildWorkerContainer.js";

export type StartIngestionWorkers = ReturnType<typeof startIngestionWorkers>;
export function startIngestionWorkers(
    container: ReturnType<typeof buildWorkerContainer>,
) {
    return [
        createWorker(
            "enrollments",
            async (job) => {
                const scope = container.createEnrollmentWorkerScope(job);
                return await scope.execute();
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "courses",
            async (job) => {
                const scope = container.createCoursePlanWorkerScope(job);
                try {
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "canvasFetch",
            async (job) => {
                const scope = container.createCanvasFetchScope(job);
                try {
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "process",
            async (job) => {
                const scope = container.createProcessScope(job);
                try {
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "dbWrite",
            async (job) => {
                const scope = container.createDbWriteScope(job);
                try {
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "checkRunCompletion",
            async (job) => {
                const scope = container.createCompletionScope(job);
                try {
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),

        createWorker(
            "courseFullIngest",
            async (job) => {
                try {
                    const scope = container.createFullIngestionScope(job);
                    return await scope.execute();
                }
                catch (e) {
                    await handleWorkerError(e, job, container.repos.ingestionTasks, container.queues.checkRunCompletion, job.data.taskId);
                    throw e;
                }
            },
            container.queueOptions,
            5,
        ),
    ];
}

export async function stopWorkers(workers: Worker[]) {
    await Promise.all(workers.map(worker => worker.close()));
}