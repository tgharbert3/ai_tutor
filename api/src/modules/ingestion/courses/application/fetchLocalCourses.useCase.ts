import type { ICoursesRepository } from "@/infrastructure/interfaces/courses.repo.interface.js";

;

export class FetchAllLocalCourses {
    constructor(
        private readonly coursesRepo: ICoursesRepository,
    ) {}

    async execute(schoolId: number) {
        return await this.coursesRepo.findAllCourseIdsForSchool(schoolId);
    }
}