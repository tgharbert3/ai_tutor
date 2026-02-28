import type { PinoLogger } from "hono-pino";

import type { AuthService } from "@/modules/auth/auth.service.js";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        authService: AuthService;
        userId: string;
    };
};

export type AppEnv = "development" | "production" | "test";

export type TokenResponse = Record<string, string>;
