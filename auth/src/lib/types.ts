import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type APPOpenAPI = OpenAPIHono<AppBindings>;

// Generic type which takes route handler genric and passing in AppBindings
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
