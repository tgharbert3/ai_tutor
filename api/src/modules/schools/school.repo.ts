import { eq } from "drizzle-orm";

import type { insertSchools } from "@/db/schema.js";
import type { db } from "@/lib/types.js";

import { schools } from "@/db/schema.js";

export class SchoolRepository {
    constructor(private db: db) {}

    async upsertSchool(schoolData: insertSchools) {
        return await this.db.insert(schools).values(schoolData).returning().onConflictDoUpdate({
            target: schools.canvasBaseUrl,
            set: {
                updated_at: new Date(),
            },
        });
    };

    async fetchOneSchoolByUrl(url: string) {
        return this.db.select().from(schools).where(eq(schools.canvasBaseUrl, url)).limit(1);
    }
}