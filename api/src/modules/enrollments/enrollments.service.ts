import type { EnrollmentRepository } from "./adapters/enrollments.repo.js";

import { fetchUserEnrollmentsFromCanvas } from "./enrollments.client.js";

export class EnrollmentsService {
    constructor(
        private readonly repo: EnrollmentRepository,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
    ) {}

    async fetchLocalActiveEnrollmentIds(userId: string) {
        const response = await this.repo.findAllActiveEnrollmetIds(userId);
        return response;
    };

    async fetchEnrollmentsFromCanvas() {
        const response = fetchUserEnrollmentsFromCanvas(this.apiToken, this.canvasBaseUrl);
        return response;
    };

    async setEnrollmentToFalse(userId: string, canvasIds: number[]) {
        await this.repo.setActiveToFalse(userId, canvasIds);
    }
}