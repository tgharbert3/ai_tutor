import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

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
            throw new HTTPException(HttpStatusCodes.CONFLICT, { message: "Email already exists" });
        }
        throw new Error(`inserted user failed ${error}`, {cause: error as any});
    }
}

export async function findOneUserById(userIdToFind: string): Promise<safeUserType | undefined> {
    return await db.query.users.findFirst({ where: eq(users.id, userIdToFind), columns: {
        id: true,
        username: true,
        email: true,
        canvasToken: true,
        passwordHash: false,
        canvasBaseUrl: true,
    } });
};

export async function findOneUserByEmail(email: string): Promise<getOneUserType | undefined> {
    return await db.query.users.findFirst({ where: eq(users.email, email) });
}
