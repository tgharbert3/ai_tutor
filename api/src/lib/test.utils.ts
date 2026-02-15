import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";

import * as schema from "@/db/schema.js";

export async function createTestDb() {
    const db = drizzle(new PGlite(), { schema });
    await migrate(db, {
        migrationsFolder: path.resolve(__dirname, "../db/migrations/"),
    });

    return db;
}