import type { Queue } from "bullmq";

import type { CanvasApiPort } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/courseActivityStream.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/enrollment.interface.js";
import type { IIngestionRun } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { IIngestionTask } from "@/infrastructure/interfaces/ingestionTaskt.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/user.repo.interface.js";

export type Context = Readonly<{
    userId: string;
    email: string;
    apiToken: string;
    canvasBaseUrl: string;
}>;

export type AppRepos = Readonly<{
    users: IUserRepository;
    schools: ISchoolRepository;
    ingestionRuns: IIngestionRun;
    enrollments: IEnrollmentRepo;
    courses: ICoursesRepository;
    ingestionTasks: IIngestionTask;
    courseActivityStream: ICourseActivityStreamRepository;
}>;

export type AppQueues = Readonly<{
    enrollments: Queue;
    courses: Queue;
    canvasFetch: Queue;
    courseFullIngest: Queue;
    courseChange: Queue;
}>;

export type AppClients = Readonly<{
    canvasClient: CanvasApiPort;
}>;