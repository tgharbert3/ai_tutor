import type { PinoLogger } from "hono-pino";

import { z } from "zod";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
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
