import { createMiddleware } from "hono/factory";

import { ServiceContainer } from "@/modules/services/service.container.js";

export const serviceContainer = new ServiceContainer();
export const ServiceContainerMiddleware = createMiddleware(async (c, next) => {
    const authService = serviceContainer.getAuthService;
    c.set("authService", authService);
    await next();
});
