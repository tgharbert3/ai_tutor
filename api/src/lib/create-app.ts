import { Hono } from "hono";

import type { HttpContainer } from "@/app/composition/containers/buildHttpContainer.js";

import onError from "@/app/http/middlewares/onError.js";
import { configurePinoLogger } from "@/app/http/middlewares/pino-logger.js";

import type { AppBindings } from "./types.js";

export function CreateRouter(httpContainer: HttpContainer) {
    const app = new Hono<AppBindings>({ strict: false });
    app.use("*", async (c, next) => {
        c.set("httpContainer", httpContainer);
        await next();
    });
    return app;
}

export default function createApp(httpContainer: HttpContainer) {
    const app = CreateRouter(httpContainer);
    app.use(configurePinoLogger());
    app.onError(onError);
    return app;
}