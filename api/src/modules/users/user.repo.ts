import type { db, PartialUser } from "@/lib/types.js";

import { users } from "@/db/schema.js";

export class UserRepository {
    constructor(private db: db) {}

    async fetchOneUserByIdWithSchoolInfo(userId: string) {
        return this.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            with: {
                school: true,
            },
        });
    };

    async upsertUser(user: PartialUser) {
        return this.db.insert(users).values(user).returning().onConflictDoUpdate({
            target: users.id,
            set: {
                email: user.email,
                schoolId: user.schoolId,
                updated_at: new Date(),
            },
        });
    };
}