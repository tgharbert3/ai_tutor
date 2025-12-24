import { Hono } from "hono";

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
  return app;
}
