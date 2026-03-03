import { desc, eq } from "drizzle-orm";

import type { db } from "@/lib/types.js";

import { courseActivityStream } from "@/infrastructure/db/schema.js";

import type { CourseActivityStreamRepositoryPort } from "../ports/courseActivityStream.port.js";

export class DrizzleCourseActivityStreamRepository implements CourseActivityStreamRepositoryPort {
    constructor(private db: db) {}

    async insertNewStreamItem() {}

    /**
     * Finds the most recent canvasStreamId in our local database
     * @returns id of the canvasStreamId
     */
    async findMostRecentStreamItemId(courseId: number): Promise<number> {
        const [row] = await this.db.select().from(courseActivityStream).orderBy(desc(courseActivityStream.id)).where(eq(courseActivityStream.courseId, courseId));
        return row.id;
    }
};