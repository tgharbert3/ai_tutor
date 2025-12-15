import type { ZodError } from "zod";

import { z } from "zod";

const EnvSchema = z.object({
  ENVIRONMENT: z.string().default("development"),
  PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
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
