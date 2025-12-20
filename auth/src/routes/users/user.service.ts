import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { insertUser } from "@/db/schema.js";

import db from "@/db/index.js";
import { users } from "@/db/schema.js";

export async function insertOneUser(user: insertUser) {
  const hashedPassword = await Bun.password.hash(user.password);
  const hashedUser = {
    ...user,
    password: hashedPassword,
  };
  // It should all insert and fail becuase the only unique or FK constraint is unqiue email
  // TODO: Final a cleaner way to handle this
  const [inserted] = await db.insert(users).values(hashedUser).returning().onConflictDoNothing();
  if (!inserted) {
    throw new HTTPException(HttpStatusCodes.CONFLICT, { message: "Email already exists" });
  }
  // destructure the password out of the return type
  const { password, ...safeUser } = inserted;
  return safeUser;
}
