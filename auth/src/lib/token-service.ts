import { sign } from "hono/jwt";

import type { insertUser } from "@/db/schema.js";

import env from "@/env.js";

export async function generateAccessToken(user: insertUser) {
  const payload = {
    id: user.id!,
    username: user.username,
    role: "student",
  };
  const accessToken = await sign(payload, env.JWT_SECRET, "HS256");

  return accessToken;
}
