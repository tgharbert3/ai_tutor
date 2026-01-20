import { insertTokenType, refresh_tokens } from "@/db/schema.js";
import db from "@/db/index.js";
import { eq } from "drizzle-orm";

export const insertRefreshToken = async (data: insertTokenType) => {
    const [inserted] = await db.insert(refresh_tokens).values(data).returning();
    if (!inserted) {
        return undefined;
    };
    return inserted;
}

export const selectRefreshToken = async (tokenId: number) => {
    return await db.query.refresh_tokens.findFirst({ where: eq(refresh_tokens.id, tokenId) })

}