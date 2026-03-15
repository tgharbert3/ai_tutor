import { eq } from "drizzle-orm";

import type { insertCourseType } from "@/infrastructure/db/schema.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { db } from "@/lib/types.js";

import { courses } from "@/infrastructure/db/schema.js";

export class DrizzleCourseRepository implements ICoursesRepository {
    constructor(private db: db) {}

    async findAllCanvasCourseIdsForSchool(schoolId: number): Promise<number[]> {
        const rows = await this.db.select({ canvasCourseIds: courses.canvasCourseId }).from(courses).where(eq(courses.schoolId, schoolId));

        return rows.map(row => row.canvasCourseIds);
    }

    async insertCourse(course: insertCourseType): Promise<number> {
        const [newCourse] = await this.db.insert(courses).values(course).onConflictDoUpdate({
            target: [courses.canvasCourseId, courses.schoolId],
            set: {
                lastSyncedAt: new Date(),
            },
        }).returning();
        return newCourse.id;
    }

    async findAllCourseIdsForSchool(schoolId: number): Promise<number[]> {
        const rows = await this.db.select({ courseIds: courses.id })
            .from(courses)
            .where(
                eq(courses.schoolId, schoolId),
            );
        return rows.map(row => row.courseIds);
    }
};