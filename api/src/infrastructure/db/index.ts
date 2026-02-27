import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import env from "@/env.js";

let _db: any;

export function getDb() {
    if (env.NODE_ENV === "test") {
        throw new Error("Do not use getDb() in tests. Use Dependency Injection!");
    }
    if (!_db) {
        const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
        _db = drizzle(pool);
    }
    return _db;
}