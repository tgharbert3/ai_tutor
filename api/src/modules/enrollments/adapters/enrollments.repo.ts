import { and, eq, inArray } from "drizzle-orm";

import type { insertUserEnrollment } from "@/infrastructure/db/schema.js";
import type { db } from "@/lib/types.js";

import { userEnrollments } from "@/infrastructure/db/schema.js";

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

    async findAllEnrollments(userId: string) {
        return await this.db
            .select()
            .from(userEnrollments)
            .where(and(
                eq(userEnrollments.userId, userId),
                eq(userEnrollments.isActive, true),
            ));
    };

    async findAllActiveEnrollmetIds(userId: string) {
        const rows = await this.db
            .select({
                courseId: userEnrollments.courseId,
            })
            .from(userEnrollments)
            .where(
                and(
                    eq(userEnrollments.userId, userId),
                    eq(userEnrollments.isActive, true),
                ),
            );
        return rows.map(r => r.courseId);
    };

    async setActiveToFalse(userId: string, canvasId: number[]) {
        return await this.db.update(userEnrollments)
            .set({ isActive: false })
            .where(
                and(
                    eq(userEnrollments.userId, userId),
                    inArray(userEnrollments.canvasUserId, canvasId),
                ),
            )
            .returning();
    }
}