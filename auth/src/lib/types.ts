import type { PinoLogger } from "hono-pino";

import type { env } from "@/env.js";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        env: env;
    };
};

export type AppEnv = "development" | "production" | "test";
