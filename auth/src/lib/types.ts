import type { PinoLogger } from "hono-pino";

import type { AuthService } from "@/modules/auth/auth.service.js";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        authService: AuthService;
    };
};

export type AppEnv = "development" | "production" | "test";
