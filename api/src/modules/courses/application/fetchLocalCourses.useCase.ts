import type { CoursesRepositoryPort } from "../ports/courses.repo.port.js";

export class FetchAllLocalCoursesUseCase {
    constructor(
        private readonly coursesRepo: CoursesRepositoryPort,
    ) {}

    async execute(schoolId: number) {
        return await this.coursesRepo.findAllCourseIdsForSchool(schoolId);
    }
}