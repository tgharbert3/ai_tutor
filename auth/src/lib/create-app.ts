import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { configurePinoLogger } from "src/middlewares/pino-logger.js";

import type { AppBindings } from "./types.js";

/**
 * Resuable function to create a router/OpenAPIHono instance
 * @returns new instance of OpenAPIHono without extra middleware
 */
export function CreateRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = CreateRouter();
  app.use(serveEmojiFavicon("📝"));
  app.use(configurePinoLogger());

  // Middlewares from stoker library
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
