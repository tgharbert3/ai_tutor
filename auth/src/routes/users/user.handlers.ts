import type { AppRouteHandler } from "@/lib/types.js";

import db from "@/db/index.js";

import type { GetOneRoute } from "./user.routes.js";

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const user = await db.query.users.findFirst({
    // fields are the columns in the table and the operators are eq, ne, gt, etc...
    where: (fields, operators) => {
      return operators.eq(fields.id, id);
    },
  });

  return c.json(user);
};
