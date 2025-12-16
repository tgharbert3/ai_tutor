import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
});

export type getOneUser = typeof users.$inferSelect;
