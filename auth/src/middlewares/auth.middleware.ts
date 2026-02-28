import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const AuthMiddleware = createMiddleware(async (c, next) => {
    const at = getCookie(c, "at", "host");
    await next();
});