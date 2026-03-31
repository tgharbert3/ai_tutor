import type { Queue } from "bullmq";

import type { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import type { CanvasApiPort } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/repos/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/repos/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/repos/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/repos/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/repos/user.repo.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { RedisPubSubService } from "@/infrastructure/redis.pubSub/redis.pubSub.js";
import type { SanitizeHtml } from "@/infrastructure/sanitizeHtml/sanitizeHtml.js";

export type Context = Readonly<{
    userId: string;
    email: string;
    apiToken: string;
    canvasBaseUrl: string;
}>;

export type AppRepos = Readonly<{
    users: IUserRepository;
    schools: ISchoolRepository;
    ingestionRuns: IIngestionRunRepository;
    enrollments: IEnrollmentRepo;
    courses: ICoursesRepository;
    ingestionTasks: IIngestionTaskRepository;
    courseActivityStream: ICourseActivityStreamRepository;
    canvasRawDocuments: ICanvasRawDocumentsRepository;
    courseInfo: ICourseInfoRepository;
}>;

export type AppQueues = Readonly<{
    enrollments: Queue;
    courses: Queue;
    canvasFetch: Queue;
    courseFullIngest: Queue;
    courseChange: Queue;
    process: Queue;
    dbWrite: Queue;
    checkRunCompletion: Queue;
    vectorization: Queue;
}>;

export type AppClients = Readonly<{
    canvasClient: CanvasApiPort;
}>;

export interface AppContainerDeps {
    canvasFactory: CanvasClientFactory;
    clientFactory: ClientApiPortFactory;
    sanitizeHtml: SanitizeHtml;
    // TODO: Make this into an interface
    pubSubService: RedisPubSubService;
}