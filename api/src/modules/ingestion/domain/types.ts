import type { Job, Queue } from "bullmq";

import type { AppQueues, AppRepos } from "@/app/composition/types.js";
import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/enrollment.interface.js";
import type { IIngestionRun } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { IIngestionTask } from "@/infrastructure/interfaces/ingestionTaskt.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { EnrollmentJob } from "@/modules/ingestion/background/domain/types.js";

export interface WorkerDeps {
    ingestionRunId: string;
    taskId: string;
}

export interface SyncUserEnrollmentsUseCaseDeps {
    job: Job<EnrollmentJob>;
    ingestionRunsRepo: IIngestionRun;
    enrollmentsRepo: IEnrollmentRepo;
    ingestionTasksRepo: IIngestionTask;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasApiPortFactory;
    coursesQueue: Queue;
}

export interface CourseWorkerDeps {
    job: Job<WorkerDeps>;
    repos: AppRepos;
    queues: AppQueues;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasApiPortFactory;
}

export interface FetchCanvasWorkerDeps {
    canvasFactory: CanvasApiPortFactory;
    canvasBaseUrl: string;
}

export interface FullIngestionScopeDeps {
    job: Job<WorkerDeps>;
    ingestionTaskRepo: IIngestionTask;
    ingestionRunRepo: IIngestionRun;
    fetchQueue: Queue;
}