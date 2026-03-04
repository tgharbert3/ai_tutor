import type { EnrollmentRepoPort } from "../../../infrastructure/drizzle/interfaces/enrollment.interface.js";

export class FetchUsersLocalEnrollmentsUseCase {
    constructor(
        private readonly enrollmentRepo: EnrollmentRepoPort,
    ) {}

    async execute(userId: string) {
        return await this.enrollmentRepo.findAllActiveEnrollmentIds(userId);
    }
}