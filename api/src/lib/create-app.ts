import { Hono } from "hono";

import onError from "@/middlewares/onError";
import { configurePinoLogger } from "@/middlewares/pino-logger";

import type { AppBindings } from "./types";

export function CreateRouter() {
  return new Hono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = CreateRouter();
  app.use(configurePinoLogger());
  app.onError(onError);
  return app;
}
