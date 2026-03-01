import type { EnrollmentRepoPort } from "../ports/enrollment.port.js";

export class FetchUsersLocalEnrollmentsUseCase {
    constructor(
        private readonly enrollmentRepo: EnrollmentRepoPort,
    ) {}

    async execute(userId: string) {
        return await this.enrollmentRepo.findAllActiveEnrollmentIds(userId);
    }
}