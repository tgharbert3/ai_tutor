import type { Context } from "hono";

import { DrizzleQueryError } from "drizzle-orm";
import z from "zod";

export function isUniqueConstraintError(error: unknown) {
    if (error instanceof DrizzleQueryError) {
        if ("code" in error.cause!) {
            if (error.cause?.code === "SQLITE_CONSTRAINT_UNIQUE") {
                return true;
            }
        }
    }
    return false;
}

export function handleZodeValidationLoginError(result: any, c: Context, status: 400) {
    if (!result.success) {
        return c.json({ error: "Invalid email or password" }, status);
    }
}

export function handleZodValidationRegisterError(result: any, c: Context, status: 400) {
    if (!result.success) {
        const errors = z.flattenError(result.error);
        return c.json({ errors: errors.fieldErrors }, status);
    }
}
