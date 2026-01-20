import * as jose from "jose";

import env from "@/env.js";

export class TokenService {

    private readonly key;

    constructor() {
        this.key = jose.base64url.decode(env.JWT_SECRET);
    }

    async handleRefresh(token: string) {
        const valdatedToken = await this.decryptToken(token); 
    }

    async generateAccessToken(email: string, id: string, canvasToken: string) {
         return new jose.EncryptJWT({
            email,
            canvasToken,
         })
            .setSubject(id)
            .setJti(this.#generateRandomJti())
            .setProtectedHeader({alg: "dir", enc: "A256GCM"})
            .setExpirationTime("2sec")
            .encrypt(this.key);     
    };

    async generateRefreshToken(id: string, expiration: Date, jti: string) {
        return await new jose.EncryptJWT()
            .setSubject(id)
            .setJti(jti)
            .setProtectedHeader({alg: "dir", enc: "A256GCM"})
            .setExpirationTime(expiration)
            .encrypt(this.key);
    };

    async decryptToken(tokenToDecrypt: string) {
        try {
            return await jose.jwtDecrypt(tokenToDecrypt, this.key)
        } catch (error) {
            console.error(`Invalid token`);
        }
    }

    /**
     * Facade function to get refresh token
     * @param id user id
     * @returns Refresh Token
     */
    async generateRefreshTokenFacade(id: string) {
        const refreshJti = this.#generateRandomJti();
        const refreshExpiration = this.#generateRefreshExpiration();
        return await this.generateRefreshToken(id, refreshExpiration, refreshJti);
    }

    #generateRefreshExpiration() {
        // Calcuate the date in which it expires for the db
        const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000
        const expiresAt = new Date(Date.now() + SEVEN_DAYS_IN_MS)
        return expiresAt;
    }

    #generateRandomJti() {
        return crypto.randomUUID();
    }
}

export const tokenService = new TokenService();