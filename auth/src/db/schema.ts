import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const users = sqliteTable("users", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password").notNull(),
    canvasToken: text("canvas_token").notNull(),
});

export const selectUserSchema = createSelectSchema(users);
export const safeSelectUserSchema = selectUserSchema.omit({
    passwordHash: true,
});
export const insertUserSchema = createInsertSchema(
    users,
    {
        username: schema => schema.min(1),
        passwordHash: schema => schema.min(8),
        email: schema => schema.email(),
        canvasToken: schema => schema.min(1),
    },
)
    .omit({
        id: true,
    });

export type getOneUserType = typeof users.$inferSelect;
export type insertUserType = typeof users.$inferInsert;
export type safeUserType = z.infer<typeof safeSelectUserSchema>;

export const refresh_tokens = sqliteTable("refresh_tokens", {
    id: integer("id", { mode: "number" }).primaryKey(),
    userId: integer("userid", {mode: "number"}).references(() => users.id).notNull(),
    token: text("token").notNull().unique(),
    familyId: text("family_id").notNull(),
    isRevoked: integer("is_revoked", {mode: "boolean"}).default(false),
    expiredAt: integer("expiredAt", {mode: "timestamp"}).notNull(),
    createdAt: integer("createdAt", {mode: "timestamp"}).notNull(),
});

export const insertRefreshSchema = createInsertSchema(refresh_tokens);
export const selectRefreshSchema = createSelectSchema(refresh_tokens);

export type insertTokenType = typeof refresh_tokens.$inferInsert;
export type selectTokenType = typeof refresh_tokens.$inferSelect;