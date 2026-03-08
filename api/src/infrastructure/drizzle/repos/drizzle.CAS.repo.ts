import { desc, eq } from "drizzle-orm";

import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/repos/courseActivityStream.interface.js";
import type { db } from "@/lib/types.js";

import { courseActivityStream } from "@/infrastructure/db/schema.js";

export class DrizzleCourseActivityStreamRepository implements ICourseActivityStreamRepository {
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