import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema.js";
import env from "@/env.js";

const db = drizzle({ connection: env.DATABASE_URL, casing: "snake_case", schema });

export default db;