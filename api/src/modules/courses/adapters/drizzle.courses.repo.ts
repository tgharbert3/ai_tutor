import { eq } from "drizzle-orm";

import type { db } from "@/lib/types.js";

import { courses } from "@/infrastructure/db/schema.js";

import type { CoursesRepositoryPort } from "../ports/courses.repo.port.js";

export class DrizzleCourseRepository implements CoursesRepositoryPort {
    constructor(private db: db) {}

    async findAllCourseIdsForSchool(schoolId: number): Promise<number[]> {
        const rows = await this.db.select({ courseId: courses.canvasCourseId }).from(courses).where(eq(courses.schoolId, schoolId));

        return rows.map(row => row.courseId);
    }
};