import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";

export class SetEnrollmentsToFalseUseCase {
    constructor(
        private readonly enrollmentsRepo: IEnrollmentRepo,
    ) {};

    async execute(userId: string, courseIds: number[]) {
        return await this.enrollmentsRepo.setActiveToFalse(userId, courseIds);
    }
}