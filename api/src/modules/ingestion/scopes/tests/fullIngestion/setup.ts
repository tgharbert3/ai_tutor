import type { Job } from "bullmq";

import type { FullIngestionScopeDeps, WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { makeMockCanvasFetchQueue, makeMockIngestionRunsRepo, makeMockIngestionTaskRepo } from "@/modules/tests/mockingFactory.js";

export type scopeDeps = ReturnType<typeof getScopeDeps>;

export function getScopeDeps() {
    const ingestionTask = makeMockIngestionTaskRepo();
    const ingestionRun = makeMockIngestionRunsRepo();
    const fetchQueue = makeMockCanvasFetchQueue();

    return {
        ingestionTaskRepo: ingestionTask,
        ingestionRunRepo: ingestionRun,
        fetchQueue,
    };
}

export function makeMockWorkerDeps(job: Job<WorkerDeps>, scopeDeps: scopeDeps) {
    return {
        job,
        ...scopeDeps,
    } satisfies FullIngestionScopeDeps;
};