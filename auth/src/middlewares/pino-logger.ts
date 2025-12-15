import { pinoLogger as logger } from "hono-pino";
import pino from "pino";

import env from "src/env.js";

export function configurePinoLogger() {
  if (env.ENVIRONMENT === "development") {
    return logger({
      pino: pino({
        base: null,
        level: "debug",
      }),
    });
  }
  else {
    return logger({
      pino: pino(),
    });
  }
}
