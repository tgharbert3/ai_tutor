import type { insertCourseType } from "@/infrastructure/db/schema.js";

export interface ICoursesRepository {
    findAllCanvasCourseIdsForSchool: (schoolId: number) => Promise<number[]>;
    insertCourse: (course: insertCourseType) => Promise<number>;
    findAllCourseIdsForSchool: (schoolId: number) => Promise<number[]>;
}