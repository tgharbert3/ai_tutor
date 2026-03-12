import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";

export class FetchUsersLocalEnrollmentsUseCase {
    constructor(
        private readonly enrollmentRepo: IEnrollmentRepo,
    ) {}

    async execute(userId: string) {
        return await this.enrollmentRepo.findAllActiveEnrollmentIds(userId);
    }
}