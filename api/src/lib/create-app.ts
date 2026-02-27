import { Hono } from "hono";

import type { AppContainer } from "@/app/composition/app.composititon.js";

import onError from "@/app/http/middlewares/onError.js";
import { configurePinoLogger } from "@/app/http/middlewares/pino-logger.js";

import type { AppBindings } from "./types.js";

export function CreateRouter(appContainer: AppContainer) {
    const app = new Hono<AppBindings>({ strict: false });
    app.use("*", async (c, next) => {
        c.set("appContainer", appContainer);
        await next();
    });
    return app;
}

export default function createApp(appContainer: AppContainer) {
    const app = CreateRouter(appContainer);
    app.use(configurePinoLogger());
    app.onError(onError);
    return app;
}