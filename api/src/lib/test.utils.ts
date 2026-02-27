import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";

import * as schema from "@/infrastructure/db/schema.js";

export async function createTestDb() {
    const client = new PGlite();

    const db = drizzle(client, { schema, casing: "snake_case" });

    // 2. Run migrations
    await migrate(db, {
        migrationsFolder: path.resolve(__dirname, "../db/migrations/"),
    });

    return db;
}