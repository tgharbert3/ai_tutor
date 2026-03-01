import type { EnrollmentRepoPort } from "../ports/enrollment.port.js";

export class SetEnrollmentsToFalseUseCase {
    constructor(
        private readonly enrollmentsRepo: EnrollmentRepoPort,
    ) {};

    async execute(userId: string, courseIds: number[]) {
        return await this.enrollmentsRepo.setActiveToFalse(userId, courseIds);
    }
}