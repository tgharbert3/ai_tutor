import { and, eq, inArray } from "drizzle-orm";

import type { insertUserEnrollment } from "@/infrastructure/db/schema.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";
import type { db } from "@/lib/types.js";

import { userEnrollments } from "@/infrastructure/db/schema.js";

export class DrizzleEnrollmentRepository implements IEnrollmentRepo {
    constructor(private db: db) {}

    async upsertEnrollment(enrollments: insertUserEnrollment) {
        await this.db.insert(userEnrollments).values(enrollments).returning().onConflictDoUpdate({
            target: [userEnrollments.userId, userEnrollments.courseId],
            set: {
                updated_at: new Date(),
            },
        });
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

    async findAllActiveEnrollmentIds(userId: string): Promise<number[]> {
        const rows = await this.db
            .select()
            .from(userEnrollments)
            .where(
                and(
                    eq(userEnrollments.userId, userId),
                    eq(userEnrollments.isActive, true),
                ),
            );
        return rows.map(r => r.canvasCourseId);
    };

    async setActiveToFalse(userId: string, courseIds: number[]): Promise<void> {
        await this.db.update(userEnrollments)
            .set({ isActive: false })
            .where(
                and(
                    eq(userEnrollments.userId, userId),
                    inArray(userEnrollments.canvasUserId, courseIds),
                ),
            )
            .returning();
    }

    async fetchEnrollments() {

    }
}