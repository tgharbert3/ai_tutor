import { eq } from "drizzle-orm";

import type { getOneUserType, insertUserType } from "@/db/schema.js";

import db from "@/db/index.js";
import { users } from "@/db/schema.js";

export async function insertOneUser(userToInsert: insertUserType): Promise<insertUserType> {
    const [inserted] = await db.insert(users).values(userToInsert).returning();
    return inserted;
}

export async function findOneUser(userIdToFind: number): Promise<getOneUserType> {
    const [user] = await db.select().from(users).where(eq(users.id, userIdToFind));
    return user;
};

export async function findOneuserByEmail(email: string): Promise<getOneUserType> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}
