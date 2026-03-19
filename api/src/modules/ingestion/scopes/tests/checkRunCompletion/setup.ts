import type { Job } from "bullmq";

import type { checkRunCompletionDeps } from "@/modules/ingestion/domain/types.js";

import { makeMockIngestionRunsRepo, makeMockIngestionTaskRepo } from "@/modules/tests/mockingFactory.js";

export type MockCheckRunDeps = ReturnType<typeof getMockCheckRunDeps>;
export function getMockCheckRunDeps() {
    return {
        ingestionTasks: makeMockIngestionTaskRepo(),
        ingestionRuns: makeMockIngestionRunsRepo(),
    };
}

export function makeMockCheckRunScopeDeps(job: Job, scopeDeps: MockCheckRunDeps) {
    return {
        job,
        ...scopeDeps,
    } satisfies checkRunCompletionDeps;
}