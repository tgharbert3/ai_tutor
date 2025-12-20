import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types.js";

import db from "@/db/index.js";
import { generateAccessToken } from "@/lib/token-service.js";

import type { GetOneRoute, registerUser } from "./user.routes.js";

import { insertOneUser } from "./user.service.js";

/**
 * Handler function for getting one usere
 * @param c context
 * @returns the request user | undefined
 */
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

/**
 * Handler function for inserting a user
 * @param c Hono context
 * @returns The user that was inserted
 */
export const create: AppRouteHandler<registerUser> = async (c) => {
  const user = c.req.valid("json");
  const insertedUser = await insertOneUser(user);
  const token = await generateAccessToken(insertedUser);
  return c.json({ user: insertedUser, accessToken: token, tokenType: "Bearer" }, HttpStatusCodes.OK);
};
