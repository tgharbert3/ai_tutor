import * as jose from "jose";

import env from "@/env.js";
import { insertTokenType } from "@/db/schema.js";

import * as TokenRepo from "./token.repo.js";
import { isBusyError, isUniqueConstraintError } from "@/lib/errors.js";
import { BusyError, CriticalSecurityError, TokenReuseError, TokenValidationError } from "@/lib/error.class.js";

export class TokenService {

    private readonly key;

    constructor() {
        this.key = jose.base64url.decode(env.JWT_SECRET);
    }

    async generateAccessTokenFacade(email: string, userId: string, canvasToken: string, fullUrl: string) {
        const accessJti = this.#generateRandomUUID();
        const token = await this.#generateAccessToken(email, userId, canvasToken, accessJti, fullUrl)
        return token
    };

   /**
    * Function to generate a new and insert refresh token
    * @param id
    * @param existingFamily
    * @param parentJti 
    * @returns the refresh token
    */
    async generateRefreshTokenFacade(id: string, parentJti: string | null, existingFamily: string | null) {
        // new jti
        const refreshJti = this.#generateRandomUUID();
        // new expiration
        const refreshExpiration = this.#generateRefreshExpiration();

        // path for the a new family of tokens
        if (parentJti == null && existingFamily == null) {
            existingFamily = this.#generateRandomUUID();
            const token = await this.insertFirstTokenInFamily(id, parentJti, existingFamily, refreshExpiration, refreshJti)
            return token
        }
        // new refresh token
        const token =  await this.#generateRefreshToken(id, refreshExpiration, refreshJti, parentJti, existingFamily);
        // hased token to store in db
        const tokenHash = this.#hashToken(token)

        const data: insertTokenType = {
            userId: id,
            createdAt: new Date(),
            expiredAt: refreshExpiration,
            jti: refreshJti,
            parentJti: parentJti,
            isRevoked: null,
            token: tokenHash,
            familyJti: existingFamily!,
        }

        try {
            //Try to revoke the old token and insert the new one
            const result = await TokenRepo.updateDbForRefresh(data);
            if (typeof result === "object" && result.isGracePeriod ) {
                return await this.#generateRefreshToken(
                    id, 
                    result.childToken!.expiredAt, 
                    result.childToken!.jti,
                    parentJti,
                    existingFamily,
            )}
        } catch (error: any) {
            if (isUniqueConstraintError(error) || error instanceof TokenReuseError) {
                try {
                    // Try to revoke the whole family and revoke all the tokens
                    await this.revokeEntireFamily(data.familyJti);
                } catch (error: any) {
                    // This means we were unable to revoke all the tokens and have a critical seurity error
                    console.error(`Critical Security Failure: Failed to revoke all family token
                        ${data.familyJti}`);
                    throw new Error("Internal security engine failed");
                }
                // We were able to revoke all the tokens and can logout the user
                // Only throw one type of error so the controller can handle it
                throw new TokenReuseError("Security Breach Detected");
            } 
            if (isBusyError(error)) {
                throw new BusyError("Unable to complete token transaction");
            } 
            throw error;
        }
        
        return token;
    };

    /**
     * Queries db to find token family or generates a new one
     * @param tokenToFind 
     * @returns token family
     */
    async getRefreshTokenFamily(tokenToFind: string) {
        const tokenHash = this.#hashToken(tokenToFind);
        const token = await TokenRepo.selectRefreshTokenByToken(tokenHash);
        return token ? token.familyJti : this.#generateRandomUUID();
    };

    async #generateAccessToken(email: string, userId: string, canvasToken: string, jti: string, fullUrl: string) {
        const accessTokenExpiration = env.NODE_ENV === "production" ? env.ACCESS_EXPIRATION : 100;

         return new jose.EncryptJWT({
            email,
            canvasToken, 
            canvasBaseUrl: fullUrl,
         })
            .setSubject(userId)
            .setJti(jti)
            .setProtectedHeader({alg: env.TOKEN_ALG, enc: env.TOKEN_ENC})
            .setExpirationTime(`${accessTokenExpiration}m`)
            .setIssuedAt(new Date())
            .encrypt(this.key);     
    };

    async #generateRefreshToken(id: string, expiration: Date, jti: string, parentJti: string | null, familyJti: string | null) {
        return await new jose.EncryptJWT({
            parentJti,
            familyJti,
        })
            .setSubject(id)
            .setJti(jti)
            .setProtectedHeader({alg: env.TOKEN_ALG, enc: env.TOKEN_ENC})
            .setExpirationTime(expiration)
            .setIssuedAt(new Date())
            .encrypt(this.key);
    };

    async decryptRefreshToken(tokenToDecrypt: string) {
        try {
            return await jose.jwtDecrypt(tokenToDecrypt, this.key, {
                clockTolerance: 30,
            })
        } catch (error) {
            console.warn(`JWT decryption error ${error instanceof Error ? error.message : "unknown error"}`);
            throw new TokenValidationError("Jwt decryption error");
        }
    }

    async insertFirstTokenInFamily(id: string, parentJti: null, existingFamily: string, refreshExpiration: Date, refreshJti: string) {
        const newToken = await this.#generateRefreshToken(id, refreshExpiration, refreshJti, parentJti, existingFamily);
        const tokenHash = this.#hashToken(newToken);

        const data: insertTokenType = {
            userId: id,
            createdAt: new Date(),
            expiredAt: refreshExpiration,
            jti: refreshJti,
            parentJti: parentJti,
            isRevoked: null,
            token: tokenHash,
            familyJti: existingFamily,
        };

        const insertedToken = await TokenRepo.insertRefreshToken(data);
        if (!insertedToken) throw new Error("Failed to insert token")
        return newToken
    };

    async revokeEntireFamily(familyJti: string) {
        const rowsAffected = await TokenRepo.revokeAllTokens(familyJti);

        if (rowsAffected === 0) {
            throw new CriticalSecurityError("Security breach and unable to clear the tokens")
        }
    }

    async revokeTokenByJti(jti: string) {
        const rowsAffected = await TokenRepo.revokeTokenByJti(jti);
        if (rowsAffected !== 1) {
            console.warn(`${jti} token was not found or already revoked`);
        }
        return true
    }

    async getTokenByJti(jti: string) {
        return await TokenRepo.selectRefreshTokenByJti(jti);
    }

    #generateRefreshExpiration() {
        // Calcuate the date in which it expires for the db
        const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000
        const expiresAt = new Date(Date.now() + SEVEN_DAYS_IN_MS)
        return expiresAt;
    }

    #generateRandomUUID() {
        return crypto.randomUUID();
    }

    #hashToken(token: string) {
        const hasher = new Bun.CryptoHasher("sha256");
        hasher.update(token);
        return hasher.digest("hex")
    }
}

export const tokenService = new TokenService();