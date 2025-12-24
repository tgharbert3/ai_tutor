import { Hono } from "hono";

/**
 * Resuable function to create a router/OpenAPIHono instance
 * @returns new instance of OpenAPIHono without extra middleware
 */
export function CreateRouter() {
  return new Hono();
}

/**
 * Resuable function to creat OpenAPIHono app
 * @returns the created app
 */
export default function createApp() {
  const app = CreateRouter();

  return app;
}
