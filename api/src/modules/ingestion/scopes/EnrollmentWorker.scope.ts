import type { SyncUserEnrollmentsUseCaseDeps } from "./domain/types.js";

import { SyncUserEnrollmentsUseCase } from "./applications/syncUserEnrollments.useCase.js";

export class EnrollmentWorkerScope {
    private readonly syncUserEnrollmentUC: SyncUserEnrollmentsUseCase;
    constructor(
        private readonly syncUserEnrollmentsUCDeps: SyncUserEnrollmentsUseCaseDeps,
    ) {
        this.syncUserEnrollmentUC = new SyncUserEnrollmentsUseCase(this.syncUserEnrollmentsUCDeps);
    };

    // Possibly wrap in try catch or result pattern to be able to update to failed if the job fails
    async execute() {
        return this.syncUserEnrollmentUC.execute();
    }
}