import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
});

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(
  users,
  {
    username: schema => schema.min(1),
  },
)
  .omit({
    id: true,
  });

export type getOneUser = typeof users.$inferSelect;
export type insertUser = typeof users.$inferInsert;
