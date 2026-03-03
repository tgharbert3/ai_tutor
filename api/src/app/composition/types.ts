import type { Queue } from "bullmq";

import type { CanvasApiPort } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { IngestionFlowPort } from "@/modules/background/flows/ingestion.port.js";
import type { CourseActivityStreamRepositoryPort } from "@/modules/courseActivityStream/ports/courseActivityStream.port.js";
import type { SyllabusFlowPort } from "@/modules/courses/flows/syllabus.port.js";
import type { CoursesRepositoryPort } from "@/modules/courses/ports/courses.repo.port.js";
import type { EnrollmentRepoPort } from "@/modules/enrollments/ports/enrollment.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";
import type { IngestionTaskPort } from "@/modules/ingestionTasks/ports/ingestionTask.port.js";
import type { SchoolRepositoryPort } from "@/modules/schools/ports/school.repo.port.js";
import type { UserRepositoryPort } from "@/modules/users/ports/user.repo.port.js";

export type Context = Readonly<{
    userId: string;
    email: string;
    apiToken: string;
    canvasBaseUrl: string;
}>;

export type AppRepos = Readonly<{
    users: UserRepositoryPort;
    schools: SchoolRepositoryPort;
    ingestionRuns: IngestionRunPort;
    enrollments: EnrollmentRepoPort;
    courses: CoursesRepositoryPort;
    ingestionTasks: IngestionTaskPort;
    courseActivityStream: CourseActivityStreamRepositoryPort;
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

export type AppFlows = Readonly<{
    ingestionFlow: IngestionFlowPort;
    syllabusFlow: SyllabusFlowPort;
}>;