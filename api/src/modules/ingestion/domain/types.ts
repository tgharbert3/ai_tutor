import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { EnrollmentJob } from "@/modules/background/domain/types.js";
import type { EnrollmentRepoPort } from "@/modules/enrollments/ports/enrollment.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";

export interface SyncUserEnrollmentsUseCaseDeps {
    jobData: EnrollmentJob;
    ingestionRunsRepo: IngestionRunPort;
    enrollmentsRepo: EnrollmentRepoPort;
    clientFactory: ClientApiPortFactory;
    canvasFactory: CanvasApiPortFactory;
}