import { createRoute, z } from "@hono/zod-openapi";

import { CreateRouter } from "src/lib/create-app.js";

const router = CreateRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
        description: "Auth router",
      },
    },
  }), (c) => {
    return c.json({
      message: "auth API",
    });
  });

export default router;
