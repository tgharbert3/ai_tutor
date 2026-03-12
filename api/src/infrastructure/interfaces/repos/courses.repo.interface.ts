import type { insertCourseType } from "@/infrastructure/db/schema.js";

export interface ICoursesRepository {
    findAllCourseIdsForSchool: (schoolId: number) => Promise<number[]>;
    insertCourse: (course: insertCourseType) => Promise<number>;
}