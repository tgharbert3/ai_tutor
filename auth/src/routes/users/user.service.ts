import type { insertUser } from "@/db/schema.js";

import db from "@/db/index.js";
import { users } from "@/db/schema.js";

export async function insertOneUser(user: insertUser) {
  const hashedPassword = await Bun.password.hash(user.password);
  const hashedUser = {
    ...user,
    password: hashedPassword,
  };
  const [inserted] = await db.insert(users).values(hashedUser).returning();
  // destructure the password out of the return type
  const { password, ...safeUser } = inserted;
  return safeUser;
}
