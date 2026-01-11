import { eq } from "drizzle-orm";

import type { getOneUserType, insertUserType, safeUserType } from "@/db/schema.js";

import db from "@/db/index.js";
import { users } from "@/db/schema.js";

export async function insertOneUser(userToInsert: insertUserType): Promise<insertUserType> {
    const [inserted] = await db.insert(users).values(userToInsert).returning();
    return inserted;
}

export async function findOneUserById(userIdToFind: number): Promise<safeUserType> {
    const [user] = await db.select().from(users).where(eq(users.id, userIdToFind));
    return user;
};

export async function findOneUserByEmail(email: string): Promise<getOneUserType> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}
