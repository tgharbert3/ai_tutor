import * as jose from "jose";

import type { JWTData } from "@/lib/types.js";

import env from "@/env.js";

export class TokenService {
    private readonly key;

    constructor() {
        this.key = jose.base64url.decode(env.JWT_SECRET);
    }

    async decryptAcesssToken(tokenToDecrypt: string): Promise<JWTData> {
        try {
            const { payload } = await jose.jwtDecrypt(tokenToDecrypt, this.key, {
                clockTolerance: 5,
            }) as jose.JWTDecryptResult & { payload: JWTData };
            if (!payload)
                throw new Error("No token data");
            return payload;
        }
        catch (error) {
            console.warn(`JWT decryption error ${error instanceof Error ? error.message : "unknown error"}`);
            throw Error;
        }
    }
}

export const tokenService = new TokenService();