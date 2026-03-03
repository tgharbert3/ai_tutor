import type { Job, Queue } from "bullmq";

import type { AppQueues, AppRepos } from "@/app/composition/types.js";
import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { EnrollmentJob } from "@/modules/background/domain/types.js";
import type { EnrollmentRepoPort } from "@/modules/enrollments/ports/enrollment.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";
import type { IngestionTaskPort } from "@/modules/ingestionTasks/ports/ingestionTask.port.js";

export interface WorkerDeps {
    ingestionRunId: string;
    taskId: string;
}

export interface SyncUserEnrollmentsUseCaseDeps {
    job: Job<EnrollmentJob>;
    ingestionRunsRepo: IngestionRunPort;
    enrollmentsRepo: EnrollmentRepoPort;
    ingestionTasksRepo: IngestionTaskPort;
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
    ingestionTaskRepo: IngestionTaskPort;
    ingestionRunRepo: IngestionRunPort;
    fetchQueue: Queue;
}