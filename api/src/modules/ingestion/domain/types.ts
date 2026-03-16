import type { Job, Queue } from "bullmq";

import type { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/repos/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/repos/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/repos/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";
import type { ISanitizeHtml } from "@/infrastructure/interfaces/sanitizeHtml/sanitizeHtml.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { RedisPubSubService } from "@/infrastructure/redis.pubSub/redis.pubSub.js";
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
    checkRunCompletion: Queue;
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
    checkRunCompletion: Queue;
}

export interface DbWriteScopeDeps {
    job: Job<WorkerDeps>;
    ingestionTasks: IIngestionTaskRepository;
    ingestonRuns: IIngestionRunRepository;
    canvasRawDocuments: ICanvasRawDocumentsRepository;
    courseInfo: ICourseInfoRepository;
    enrollments: IEnrollmentRepo;
    courses: ICoursesRepository;
    processQueue: Queue;
    checkRun: Queue;
    dbWrite: Queue;
}

export interface ProcessWorkerDeps {
    job: Job<WorkerDeps>;
    ingestionTasks: IIngestionTaskRepository;
    courseInfo: ICourseInfoRepository;
    canvasRawDoc: ICanvasRawDocumentsRepository;
    sanitizeHtml: ISanitizeHtml;
    dbWrite: Queue;
    checkRunCompletion: Queue;
}

export interface checkRunCompletionDeps {
    job: Job<{ ingestionRunId: string }>;
    ingestionTasks: IIngestionTaskRepository;
    ingestionRuns: IIngestionRunRepository;
    pubSubService: RedisPubSubService;
}