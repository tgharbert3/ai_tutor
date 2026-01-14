import { Hono } from "hono";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import type { AppBindings } from "@/lib/types.js";
import type { AppType } from "@/modules/auth/auth.index.js";

import { configurePinoLogger } from "@/middlewares/pino-logger.js";

/**
 * Resuable function to create a router/OpenAPIHono instance
 * @returns new instance of OpenAPIHono without extra middleware
 */
export function CreateRouter() {
    return new Hono<AppBindings>({
        strict: false,
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

export function createTestApp(router: AppType) {
    return createApp().route("/", router);
}
