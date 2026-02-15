import { Hono } from "hono";

import onError from "@/middlewares/onError.js";
import { configurePinoLogger } from "@/middlewares/pino-logger.js";

import type { AppBindings } from "./types.js";

export function CreateRouter() {
    return new Hono<AppBindings>({
        strict: false,
    });
}

export default function createApp() {
    const app = CreateRouter();
    app.use(configurePinoLogger());
    app.onError(onError);
    return app;
}