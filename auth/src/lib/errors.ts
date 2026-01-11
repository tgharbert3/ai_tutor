import { DrizzleQueryError } from "drizzle-orm";

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
