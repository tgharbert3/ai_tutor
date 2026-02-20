import type { EnrollmentRepository } from "./enrollments.repo.js";

export class EnrollmentsService {
    constructor(
        private readonly repo: EnrollmentRepository,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
    ) {}

    async fetchLocalActiveEnrollmentIds(userId: string) {
        const response = await this.repo.findAllActiveEnrollmetIds(userId);
        return response;
    }
}