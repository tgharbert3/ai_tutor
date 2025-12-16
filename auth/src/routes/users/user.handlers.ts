import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

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
  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }
  return c.json(user, HttpStatusCodes.OK);
};
