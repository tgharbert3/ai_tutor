import type { PinoLogger } from "hono-pino";

import { z } from "zod";

import type { ServiceContainer } from "@/modules/services.container";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        services: ServiceContainer;
    };
};

export type AppEnv = "development" | "production" | "test";

// zod types

export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    course_code: z.string(),
});

export type CanvasCourse = z.infer<typeof CanvasCourseSchema>;
