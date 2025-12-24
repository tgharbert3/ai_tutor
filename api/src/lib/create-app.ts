import { Hono } from "hono";

import type { AppBindings } from "./types";

export function CreateRouter() {
  return new Hono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = CreateRouter();
  return app;
}
