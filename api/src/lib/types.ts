import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type AppEnv = "development" | "production" | "test";
