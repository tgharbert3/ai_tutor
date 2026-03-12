import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "./schema.js";

export async function getTestDb() {
    const client = new PGlite();
    const testDb = drizzle(client, { schema });

    await migrate(testDb, {
        migrationsFolder: "./src/infrastructure/db/migrations",
    });
    return testDb;
}