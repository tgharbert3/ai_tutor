import type { EnrollmentQueuePort } from "@/modules/background/enrollments/ports/enrollment.queue.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";
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
    ingestionRun: IngestionRunPort;
}>;

export type AppQueues = Readonly<{
    enrollmentQueue: EnrollmentQueuePort;
}>;