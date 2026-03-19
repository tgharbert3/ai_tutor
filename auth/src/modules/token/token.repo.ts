import { insertTokenType, refresh_tokens } from "@/db/schema.js";
import db from "@/db/index.js";
import { eq, desc } from "drizzle-orm";
import { TokenReuseError } from "@/lib/error.class.js";

export const insertRefreshToken = async (data: insertTokenType) => {
    const [inserted] = await db.insert(refresh_tokens).values(data).returning();
    return inserted;
};

export const selectRefreshTokenByTokenId = async (tokenId: string) => {
    return await db.query.refresh_tokens.findFirst({ where: eq(refresh_tokens.id, tokenId) })

};

export const selectRefreshTokenByToken = async (token: string) => {
    return await db.query.refresh_tokens.findFirst({ where: eq(refresh_tokens.token, token) });
};

export const selectRefreshTokenByJti = async (jti: string) => {
    return await db.query.refresh_tokens.findFirst({where: eq(refresh_tokens.jti, jti)});
}

export const updateDbForRefresh = async (data: insertTokenType) => {

    const GRACE_PERIOD = 10 * 1000;

    return await db.transaction(
        async (tx) => {
            
            const [parentToken] = await tx.select()
                .from(refresh_tokens)
                .where(eq(refresh_tokens.jti, data.parentJti!))

            if (!parentToken) {
                throw new Error("Parent token not found");
            }

            // This is for the reuse detection.
            if (parentToken?.isRevoked !== null) {
                const now = Date.now();

                const revokedAt = new Date(parentToken.isRevoked).getTime();

                if (now - revokedAt > GRACE_PERIOD) {
                    throw new TokenReuseError("Security Breach: Token resused");
                }

                // Return child token if it is within the grace period
                if (now - revokedAt < GRACE_PERIOD) {
                    const [childToken] = await tx.select()
                        .from(refresh_tokens)
                        .where(eq(refresh_tokens.parentJti, data.parentJti!))
                        .orderBy(desc(refresh_tokens.createdAt))
                        .limit(1);
                    return {isGracePeriod: true, childToken};
                }
                
            };

            await tx.update(refresh_tokens)
                .set({isRevoked: new Date()})
                .where(eq(refresh_tokens.jti, data.parentJti!));

            await tx.insert(refresh_tokens).values(data);

            return {isGracePeriod: false, data};
        }, 
    );
}

export const revokeAllTokens = async (familyJti: string) => {
    return (await db.update(refresh_tokens).set({isRevoked: new Date()}).where(eq(refresh_tokens.familyJti, familyJti))).rowCount;
}

export const revokeTokenByJti = async (jtiToRevoke: string) => {
    return (await db.update(refresh_tokens).set({isRevoked: new Date()}).where(eq(refresh_tokens.jti, jtiToRevoke))).rowCount
};