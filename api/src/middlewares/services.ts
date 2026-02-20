import { createMiddleware } from "hono/factory";

import type { JWTData } from "@/lib/types.js";

import { courseRepoSingleton, userRepoSingleton } from "@/modules/repo.singletons.js";
import { SchoolService } from "@/modules/schools/school.service.js";
import { ServiceContainer } from "@/modules/services.container.js";

export const ServiceContainerMiddleware = createMiddleware(async (c, next) => {
    const JWEData: JWTData = c.get("user");

    const apiToken = JWEData.canvasToken;
    const canvasBaseUrl = JWEData.fullurl;
    const normalizedCanvasUrl = SchoolService.normalizeCanvasUrl(canvasBaseUrl);

    const serviceContainer = new ServiceContainer(
        apiToken,
        normalizedCanvasUrl,
        courseRepoSingleton,
        userRepoSingleton,
    );
    c.set("services", serviceContainer);
    await next();
});