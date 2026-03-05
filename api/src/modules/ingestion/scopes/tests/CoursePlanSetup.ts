import type { Job } from "bullmq";

import { vi } from "vitest";

import type { CourseWorkerDeps } from "../../domain/types.js";
import type { IngestionTask, IngestionTaskET, IngestionTaskKind, IngestionTaskStatus } from "../../ingestionTasks/domain/types.js";
import type { scopeDepsReturnType } from "./CoursePlanWorker.unit.test.js";

import { makeMockCanvasClient, makeMockCanvasFactory, makeMockClient, makeMockClientFactory, makeMockCourseActivityStreamRepo, makeMockCourseChangeQueue, makeMockCoursesRepo, makeMockIngestionRunsRepo, makeMockIngestionTaskRepo } from "../../tests/mockingFactory.js";

export function getScopeDeps() {
    const ingestionTasks = makeMockIngestionTaskRepo();
    const ingestionRuns = makeMockIngestionRunsRepo();
    const courses = makeMockCoursesRepo();
    const courseActivityStream = makeMockCourseActivityStreamRepo();
    const courseFullIngest = makeMockCourseChangeQueue();
    const courseChange = makeMockCourseChangeQueue();
    const clientFactory = makeMockClientFactory();
    const canvasFactory = makeMockCanvasFactory();
    const canvasClient = makeMockCanvasClient();
    const internalClient = makeMockClient();

    return {
        ingestionTasks,
        ingestionRuns,
        courses,
        courseActivityStream,
        courseFullIngest,
        courseChange,
        clientFactory,
        canvasFactory,
        canvasClient,
        internalClient,
    };
}

export function makeMockJob(jobId: string, data: { ingestionRunId: string; taskId: string }) {
    return {
        id: jobId,
        data,
        updateProgress: vi.fn(),
    } as unknown as Job;
}

export function makeMockTask(
    courseId: number,
    schoolId: number,
    taskId: string,
    kind: IngestionTaskKind,
    entityType: IngestionTaskET,
    entityId: string,
    status: IngestionTaskStatus,
) {
    return {
        courseId,
        schoolId,
        taskId,
        kind,
        entityType,
        entityId,
        status,
    } satisfies IngestionTask;
}

export function makeMockWorkerDeps(job: Job, deps: scopeDepsReturnType) {
    return {
        job,
        ...deps,
    } satisfies CourseWorkerDeps;
}