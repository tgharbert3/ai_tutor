import { createMiddleware } from "hono/factory";

import type { JWTData } from "@/lib/types.js";

import { getRedisConfig } from "@/infrastructure/config/redis.js";
import { getDb } from "@/infrastructure/db/index.js";
import { SchoolService } from "@/modules/schools/school.service.js";
import { ServiceContainer } from "@/modules/services.container.js";

export const ServiceContainerMiddleware = createMiddleware(async (c, next) => {
    const JWEData: JWTData = c.get("user");

    const apiToken = JWEData.canvasToken;
    const canvasBaseUrl = JWEData.fullurl;
    const normalizedCanvasUrl = SchoolService.normalizeCanvasUrl(canvasBaseUrl);
    const db = getDb();
    const redisConfig = getRedisConfig();
    const serviceContainer = new ServiceContainer(
        db,
        redisConfig,
        apiToken,
        normalizedCanvasUrl,
    );
    c.set("services", serviceContainer);
    await next();
});