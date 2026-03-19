import type { Job } from "bullmq";

import type { DbWriteScopeDeps } from "@/modules/ingestion/domain/types.js";

import { makeMockCanvasRawDocumentsRepo, makeMockCourseInfo, makeMockIngestionTaskRepo, makeMockProcessQueue } from "@/modules/tests/mockingFactory.js";

export type mockDbWriteDeps = ReturnType<typeof getMockDbWriteScopeDeps>;
export function getMockDbWriteScopeDeps() {
    return {
        ingestionTasks: makeMockIngestionTaskRepo(),
        canvasRawDocuments: makeMockCanvasRawDocumentsRepo(),
        courseInfo: makeMockCourseInfo(),
        processQueue: makeMockProcessQueue(),
    };
}

export function makeMockDbWriteWorkerDeps(job: Job, scopeDeps: mockDbWriteDeps) {
    return {
        job,
        ...scopeDeps,
    } satisfies DbWriteScopeDeps;
}