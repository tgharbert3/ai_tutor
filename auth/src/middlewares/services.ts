import { createMiddleware } from "hono/factory";

import { ServiceContainer } from "@/modules/services/service.container.js";

export const ServiceContainerMiddleware = createMiddleware(async (c, next) => {
    const serviceContainer = new ServiceContainer();
    const authService = serviceContainer.getAuthService;
    c.set("authService", authService);
    await next();
});
