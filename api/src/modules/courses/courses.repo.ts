import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type { insertCourseType } from "@/db/schema.js";

import { courses } from "@/db/schema.js";

export class CourseRepository {
    constructor(private db: NodePgDatabase<any>) {}

    async upsertManyCourses(course: insertCourseType[]) {
        const inserted = await this.db.insert(courses).values(course).returning().onConflictDoUpdate({
            target: courses.courseId,
            set: {
                updated_at: new Date(),
            },
        });
        return inserted;
    }

    async findAllCourses() {
        const response = await this.db.select({
            courseId: courses.courseId,
            courseName: courses.courseName,
            courseCode: courses.courseCode,
        }).from(courses);
        return response;
    }
}