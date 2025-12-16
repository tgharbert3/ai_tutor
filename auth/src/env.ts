// This file defines a type safe env

import type { ZodError } from "zod";

import { z } from "zod";

const EnvLocalSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
});

// .extend merges the zod objects
// .superRefine allows for a more validation and a better error message
const EnvSchema = z.object({
  ENVIRONMENT: z.string().default("development"),
  PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
}).extend(EnvLocalSchema.shape).superRefine((input, ctx) => {
  if (input.ENVIRONMENT === "production" && !input.DATABASE_AUTH_TOKEN) {
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
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("Invalid env");
  console.error(z.treeifyError(error));
  process.exit(1);
}

export default env;
