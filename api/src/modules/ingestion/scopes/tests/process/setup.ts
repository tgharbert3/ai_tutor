import type { Job } from "bullmq";

import type { ProcessWorkerDeps, WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { makeMockCanvasRawDocumentsRepo, makeMockCourseInfo, makeMockDbWriteQueue, makeMockIngestionTaskRepo, makeMockSanitizeHtml } from "@/modules/tests/mockingFactory.js";

export type MockProcessWorkerScopeDeps = ReturnType<typeof getMockProcessWorkerScopeDeps>;
export function getMockProcessWorkerScopeDeps() {
    return {
        ingestionTasks: makeMockIngestionTaskRepo(),
        courseInfo: makeMockCourseInfo(),
        dbWrite: makeMockDbWriteQueue(),
        sanitizeHtml: makeMockSanitizeHtml(),
        canvasRawDoc: makeMockCanvasRawDocumentsRepo(),
    };
}

export function makeMockProcessWorkerDeps(job: Job<WorkerDeps>, scopeDeps: MockProcessWorkerScopeDeps) {
    return {
        job,
        ...scopeDeps,
    } satisfies ProcessWorkerDeps;
}