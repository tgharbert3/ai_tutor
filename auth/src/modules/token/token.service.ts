import * as jose from "jose";


import env from "@/env.js";
import { insertTokenType } from "@/db/schema.js";

import * as TokenRepo from "./token.repo.js";

export class TokenService {

    private readonly key;

    constructor() {
        this.key = jose.base64url.decode(env.JWT_SECRET);
    }

    async handleRefresh(token: string) {
        const valdatedToken = await this.decryptToken(token); 
    }

    async generateAccessTokenFacade(email: string, id: string, canvasToken: string) {
        const accessJti = this.#generateRandomUUID();
        const token = await this.generateAccessToken(email, id, canvasToken, accessJti)
        return token
    }

    /**
     * Facade function to get refresh token
     * @param id user id
     * @returns Refresh Token
     */
    async generateRefreshTokenFacade(id: string, existingFamily?: string) {
        const refreshJti = this.#generateRandomUUID();
        const refreshExpiration = this.#generateRefreshExpiration();
        const token =  await this.generateRefreshToken(id, refreshExpiration, refreshJti);
        const tokenHash = this.#hashToken(token)

        const data: insertTokenType = {
            userId: Number(id),
            createdAt: new Date(Date.now()),
            expiredAt: refreshExpiration,
            isRevoked: false,
            token: tokenHash,
            familyId: existingFamily? existingFamily : this.#generateRandomUUID(),
        }

        const insertedToken = await TokenRepo.insertRefreshToken(data);
        if (!insertedToken) throw new Error("Failed to insert token")
        return token
    };

    /**
     * Queries db to find token family or generates a new one
     * @param tokenToFind 
     * @returns token family
     */
    async getRefreshTokenFamily(tokenToFind: string) {
        let family; 

        const tokenHash = this.#hashToken(tokenToFind);
        const token = await TokenRepo.selectRefreshTokenByToken(tokenHash);
        if (!token) {
            family = this.#generateRandomUUID()
        }
        family = token!.familyId;
        return family;
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

    async generateAccessToken(email: string, id: string, canvasToken: string, jti: string) {
         return new jose.EncryptJWT({
            email,
            canvasToken,
         })
            .setSubject(id)
            .setJti(jti)
            .setProtectedHeader({alg: env.TOKEN_ALG, enc: env.TOKEN_ENC})
            //TODO add this to env
            .setExpirationTime("15m")
            .encrypt(this.key);     
    };

    async generateRefreshToken(id: string, expiration: Date, jti: string) {
        return await new jose.EncryptJWT()
            .setSubject(id)
            .setJti(jti)
            .setProtectedHeader({alg: env.TOKEN_ALG, enc: env.TOKEN_ENC})
            .setExpirationTime(expiration)
            .encrypt(this.key);
    };

    //TODO: Handle the error correctly
    async decryptToken(tokenToDecrypt: string) {
        try {
            return await jose.jwtDecrypt(tokenToDecrypt, this.key)
        } catch (error) {
            console.error(`Invalid token`);
        }
    }
}

export const tokenService = new TokenService();