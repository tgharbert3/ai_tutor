import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { CreateRouter } from "@/lib/create-app.js";

const tags = ["index"];
const router = CreateRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Auth Api"),
        "Auth API Index",
      ),
    },
    tags,
  }), (c) => {
    return c.json({
      message: "auth API",
    });
  });

export default router;
