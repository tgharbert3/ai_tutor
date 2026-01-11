import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import type { getOneUserType, insertUserType, safeUserType } from "@/db/schema.js";

import db from "@/db/index.js";
import { users } from "@/db/schema.js";
import { isUniqueConstraintError } from "@/lib/errors.js";

export async function insertOneUser(userToInsert: insertUserType): Promise<safeUserType | undefined> {
    try {
        const [inserted] = await db.insert(users).values(userToInsert).returning();
        if (!inserted) {
            return undefined;
        }

        const { passwordHash, ...safeUser } = inserted;
        return safeUser;
    }
    catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new HTTPException(409, { message: "Email already exists" });
        }
        throw Error;
    }
}

export async function findOneUserById(userIdToFind: number): Promise<safeUserType | undefined> {
    return await db.query.users.findFirst({ where: eq(users.id, userIdToFind) });
};

export async function findOneUserByEmail(email: string): Promise<getOneUserType | undefined> {
    return await db.query.users.findFirst({ where: eq(users.email, email) });
}
