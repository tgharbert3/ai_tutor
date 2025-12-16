import type { AppRouteHandler } from "@/lib/types.js";

import type { GetOneRoute } from "./user.routes.js";

export const getOne: AppRouteHandler<GetOneRoute> = (c) => {
  return c.json({
    username: "user 1",
  });
};
