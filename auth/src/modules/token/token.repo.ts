import { insertTokenType, refresh_tokens } from "@/db/schema.js";
import db from "@/db/index.js";
import { eq } from "drizzle-orm";

export const insertRefreshToken = async (data: insertTokenType) => {
    const [inserted] = await db.insert(refresh_tokens).values(data).returning();
    return inserted;
};

export const selectRefreshTokenByTokenId = async (tokenId: number) => {
    return await db.query.refresh_tokens.findFirst({ where: eq(refresh_tokens.id, tokenId) })

};

export const selectRefreshTokenByToken = async (token: string) => {
    return await db.query.refresh_tokens.findFirst({ where: eq(refresh_tokens.token, token) });
};