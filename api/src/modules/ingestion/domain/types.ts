import type { Job, Queue } from "bullmq";

import type { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/enrollment.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { EnrollmentJob } from "@/modules/ingestion/background/domain/types.js";

export interface WorkerDeps {
    ingestionRunId: string;
    taskId: string;
}

export interface SyncUserEnrollmentsUseCaseDeps {
    job: Job<EnrollmentJob>;
    ingestionRunsRepo: IIngestionRunRepository;
    enrollmentsRepo: IEnrollmentRepo;
    ingestionTasksRepo: IIngestionTaskRepository;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasApiPortFactory;
    coursesQueue: Queue;
}

export interface CourseWorkerDeps {
    job: Job<WorkerDeps>;
    ingestionTasks: IIngestionTaskRepository;
    ingestionRuns: IIngestionRunRepository;
    courses: ICoursesRepository;
    courseActivityStream: ICourseActivityStreamRepository;
    courseFullIngest: Queue;
    courseChange: Queue;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasApiPortFactory;
}

export interface FetchCanvasWorkerDeps {
    canvasFactory: CanvasApiPortFactory;
    canvasBaseUrl: string;
}

export interface FullIngestionScopeDeps {
    job: Job<WorkerDeps>;
    ingestionTaskRepo: IIngestionTaskRepository;
    ingestionRunRepo: IIngestionRunRepository;
    fetchQueue: Queue;
}

export interface CanvasFetchWorkerDeps {
    job: Job<WorkerDeps>;
    ingestionTasks: IIngestionTaskRepository;
    ingestionRun: IIngestionRunRepository;
    canvasRawDocuments: ICanvasRawDocumentsRepository;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasClientFactory;
    processQueue: Queue;
    courseInfo: ICourseInfoRepository;
    dbWrite: Queue;
}

export interface DbWriteWorker extends WorkerDeps {
    docId: string;
}

export interface DbWriteScopeDeps {
    job: Job<DbWriteWorker>;
    ingestionTasks: IIngestionTaskRepository;
    canvasRawDocuments: ICanvasRawDocumentsRepository;
    courseInfo: ICourseInfoRepository;
    processQueue: Queue;
}