import type { Context } from "hono";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { tokenService } from "@/modules/auth/token.service.js";

const ACCESS_TOKEN_NAME = "__Host-at";

export function getAccessCookie(c: Context) {
    return getCookie(c, ACCESS_TOKEN_NAME);
}

export const AuthMiddleware = createMiddleware(async (c, next) => {
    const at = getAccessCookie(c);
    if (!at) {
        return c.json(
            { error: "Unauthorized" },
            403,
        );
    }
    const tokenData = await tokenService.decryptAcesssToken(at);
    c.set("user", tokenData);
    await next();
});