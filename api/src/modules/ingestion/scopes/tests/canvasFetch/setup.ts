import type { Job } from "bullmq";

import type { CanvasFetchWorkerDeps, WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { makeMockCanvasClient, makeMockCanvasFactory, makeMockCanvasRawDocumentsRepo, makeMockClient, makeMockClientFactory, makeMockCourseInfo, makeMockDbWriteQueue, makeMockIngestionRunsRepo, makeMockIngestionTaskRepo, makeMockProcessQueue } from "@/modules/ingestion/tests/mockingFactory.js";

export type MockCanvasFetchdeps = ReturnType<typeof getMockCanvasFetchScopeDeps>;
export function getMockCanvasFetchScopeDeps() {
    return {
        ingestionTasks: makeMockIngestionTaskRepo(),
        ingestionRun: makeMockIngestionRunsRepo(),
        canvasRawDocuments: makeMockCanvasRawDocumentsRepo(),
        clientFactory: makeMockClientFactory(),
        internalClient: makeMockClient(),
        canvasFactory: makeMockCanvasFactory(),
        canvasClient: makeMockCanvasClient(),
        courseInfo: makeMockCourseInfo(),
        dbWrite: makeMockDbWriteQueue(),
        processQueue: makeMockProcessQueue(),
    };
}

export function makeMockCanvasFetchDeps(job: Job<WorkerDeps>, deps: MockCanvasFetchdeps) {
    return {
        job,
        ...deps,
    } satisfies CanvasFetchWorkerDeps;
}