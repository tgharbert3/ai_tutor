// This file defines a type safe env
/* eslint-disable node/no-process-env */
import type { ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

import type { AppEnv } from "./lib/types.js";

const ENV_FILE_MAP: Record<AppEnv, string> = {
  development: ".env",
  production: ".env.production",
  test: ".env.test",
};

const currentEnv = (process.env.NODE_ENV as AppEnv) || "development";
const envFile = ENV_FILE_MAP[currentEnv] || ".env";

expand(config({
  path: path.resolve(
    process.cwd(),
    envFile,
  ),
  override: true,
}));

const BaseSchema = z.object({
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

const EnvSchema = z.discriminatedUnion("NODE_ENV", [
  BaseSchema.extend({
    NODE_ENV: z.literal("development"),
  }),
  BaseSchema.extend({
    NODE_ENV: z.literal("production"),
  }),
  BaseSchema.extend({
    NODE_ENV: z.literal("test"),
  }),
]).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production") {
    ctx.addIssue({
      code: "invalid_type",
      expected: "string",
      received: "undefined",
      path: ["DATABASE_AUTH_TOKEN"],
      message: "Must be set when NODE_ENV is 'production'",
    });
  }
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: env;

try {
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("Invalid env");
  console.error(error);
  process.exit(1);
}

export default env;
