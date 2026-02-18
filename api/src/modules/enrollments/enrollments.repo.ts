import type { insertUserEnrollment } from "@/db/schema.js";
import type { db } from "@/lib/types.js";

import { userEnrollments } from "@/db/schema.js";

export class EnrollmentRepository {
    constructor(private db: db) {}

    async upsertManyEnrollments(enrollments: insertUserEnrollment[]) {
        const inserted = await this.db.insert(userEnrollments).values(enrollments).returning().onConflictDoUpdate({
            target: userEnrollments.userId,
            set: {
                updated_at: new Date(),
            },
        });
        return inserted;
    }

    async findAllEnrollments() {
        const response = await this.db.select().from(userEnrollments);
        return response;
    }
}