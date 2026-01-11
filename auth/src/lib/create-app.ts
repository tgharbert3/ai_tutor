import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import defaultHook from "stoker/openapi/default-hook";

import type { AppBindings } from "@/lib/types.js";

import { configurePinoLogger } from "@/middlewares/pino-logger.js";

/**
 * Resuable function to create a router/OpenAPIHono instance
 * @returns new instance of OpenAPIHono without extra middleware
 */
export function CreateRouter() {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });
}

/**
 * Resuable function to creat OpenAPIHono app
 * @returns the created app
 */
export default function createApp() {
    const app = CreateRouter();
    app.use(serveEmojiFavicon("📝"));
    app.use(configurePinoLogger());

    // Middlewares from stoker library
    app.notFound(notFound);
    app.onError(onError);

    return app;
}
