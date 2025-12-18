import { pinoLogger as logger } from "hono-pino";
import pino from "pino";

import env from "@/env.js";

export function configurePinoLogger() {
  if (env.ENVIRONMENT === "development") {
    return logger({
      pino: pino({
        base: null,
        level: "debug",
      }),
    });
  }
  else if (env.ENVIRONMENT === "test") {
    return logger({
      pino: ({
        base: null,
        level: "silent",
      }),
    });
  }
  else {
    return logger({
      pino: pino(),
    });
  }
}
