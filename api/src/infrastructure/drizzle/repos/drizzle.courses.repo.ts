import { eq } from "drizzle-orm";

import type { ICoursesRepository } from "@/infrastructure/interfaces/courses.repo.interface.js";
import type { db } from "@/lib/types.js";

import { courses } from "@/infrastructure/db/schema.js";

export class DrizzleCourseRepository implements ICoursesRepository {
    constructor(private db: db) {}

    async findAllCourseIdsForSchool(schoolId: number): Promise<number[]> {
        const rows = await this.db.select({ courseId: courses.canvasCourseId }).from(courses).where(eq(courses.schoolId, schoolId));

        return rows.map(row => row.courseId);
    }
};