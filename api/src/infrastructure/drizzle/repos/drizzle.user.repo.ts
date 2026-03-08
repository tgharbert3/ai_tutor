import type { IUserRepository } from "@/infrastructure/interfaces/repos/user.repo.interface.js";
import type { db } from "@/lib/types.js";
import type { InsertUserInput, UserDto } from "@/modules/ingestion/users/domain/types.js";

import { users } from "@/infrastructure/db/schema.js";

export class DrizzleUserRepository implements IUserRepository {
    constructor(private db: db) {}

    async fetchOneUserById(userId: string): Promise<UserDto | undefined> {
        const user = await this.db.query.users.findFirst({
            columns: {
                id: true,
                schoolId: true,
                email: true,
                updated_at: false,
                created_at: false,
            },
            where: (users, { eq }) => eq(users.id, userId),
        });
        return user ?? undefined;
    };

    async upsertUser(user: InsertUserInput): Promise<UserDto> {
        const [row] = await this.db.insert(users).values(user).onConflictDoUpdate({
            target: users.id,
            set: {
                email: user.email,
                schoolId: user.schoolId,
                updated_at: new Date(),
            },
        }).returning();
        return {
            id: row.id,
            email: row.email,
            schoolId: row.schoolId,
        };
    };
}