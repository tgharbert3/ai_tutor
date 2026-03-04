import type { CoursesRepositoryPort } from "../../../infrastructure/drizzle/interfaces/courses.repo.interface.js";

export class FetchAllLocalCoursesUseCase {
    constructor(
        private readonly coursesRepo: CoursesRepositoryPort,
    ) {}

    async execute(schoolId: number) {
        return await this.coursesRepo.findAllCourseIdsForSchool(schoolId);
    }
}