import type { Job } from "bullmq";

import type { CourseWorkerDeps } from "../../domain/types.js";
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

export function makeMockWorkerDeps(job: Job, deps: scopeDepsReturnType) {
    return {
        job,
        ...deps,
    } satisfies CourseWorkerDeps;
}