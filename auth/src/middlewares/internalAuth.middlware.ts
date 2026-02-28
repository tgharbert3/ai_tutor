import { createMiddleware } from "hono/factory";
import env from "@/env.js";

export const InternalAuthMiddleware = createMiddleware(async (c, next) => {
   const provided = c.req.header("x-internal-auth");
   const expected = env.INTERNAL_AUTH;

   if (!provided || provided !== expected) {
    return c.json({error: "Unauthorized"}, 401)
   }
   await next();
});