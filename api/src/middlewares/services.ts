import { createMiddleware } from "hono/factory";

import env from "@/env.js";
import { ServiceContainer } from "@/modules/services.container";

export const ServiceContainerMiddleware = createMiddleware(async (c, next) => {
    const serviceContainer = new ServiceContainer(env.API_TOKEN, env.CANVAS_BASE_URL);
    c.set("services", serviceContainer);
    await next();
});
