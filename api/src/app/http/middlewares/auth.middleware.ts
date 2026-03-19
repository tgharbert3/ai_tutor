import type { Context } from "hono";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import * as jose from "jose";

import type { AppBindings, JWTData } from "@/lib/types.js";

import { tokenService } from "@/modules/auth/token.service.js";

const ACCESS_TOKEN_NAME = "at";

export function getAccessCookie(c: Context) {
    return getCookie(c, ACCESS_TOKEN_NAME);
}
// need try catch to handle a bad token
export const AuthMiddleware = createMiddleware<AppBindings>(async (c, next) => {
    const at = getAccessCookie(c);
    if (!at) {
        return c.json(
            { error: "Unauthorized" },
            401,
        );
    }
    try {
        const tokenData = await tokenService.decryptAcesssToken(at);
        const data = {
            userId: tokenData.sub!,
            canvasBaseUrl: tokenData.canvasBaseUrl,
            email: tokenData.email,
            canvasToken: tokenData.canvasToken,
        } satisfies JWTData;
        c.set("user", data);
        await next();
    }
    catch (error: unknown) {
        if (error instanceof jose.errors.JWTExpired) {
            return c.json({ error: "Token Expired" }, 401);
        }
    }
});