// Had to use dotenv due to commonjs and drizzle not knowing how to handle the bun env

/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
