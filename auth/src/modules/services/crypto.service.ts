import * as jose from "jose";
import env from "@/env.js";

export class CryptoService {
    private readonly key;

    constructor() {
        this.key = jose.base64url.decode(env.JWT_SECRET);
    }
    async generateAccessToken(email: string, id: string, canvasToken: string) {
         return new jose.EncryptJWT({
            email,
            canvasToken,
         })
            .setSubject(id)
            .setJti(this.#generateRandomJti())
            .setProtectedHeader({alg: "dir", enc: "A256GCM"})
            .setExpirationTime("15m")
            .encrypt(this.key);     
    };

    async generateRefreshToken(id: string) {
        return new jose.EncryptJWT()
            .setSubject(id)
            .setJti(this.#generateRandomJti())
            .setProtectedHeader({alg: "dir", enc: "A256GCM"})
            .setExpirationTime("7d")
            .encrypt(this.key);
    };

    async decryptToken(tokenToDecrypt: string) {
        const token = await jose.jwtDecrypt(tokenToDecrypt, this.key)
    }

    #generateRandomJti() {
        return crypto.randomUUID();
    }
}

export const cryptoService = new CryptoService();
