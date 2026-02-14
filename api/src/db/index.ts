import { drizzle } from "drizzle-orm/bun-sql";

import env from "@/env.js";

const db = drizzle({ connection: env.DATABASE_URL, casing: 'snake_case'})

export default db;
