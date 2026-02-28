import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

const authSchema = pgSchema("auth");

//TODO: update this to Pgtable
export const users = authSchema.table("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password").notNull(),
    canvasToken: text("canvas_token").notNull(),
    canvasBaseUrl: text("canvas_base_url").notNull(),
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
        canvasBaseUrl: schema => schema.url(),
    },
)
    .omit({
        id: true,
    });

export const refresh_tokens = authSchema.table("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    token: text("token").notNull().unique(),
    familyJti: text("family_jti").notNull(),
    jti: text("jti").notNull().unique(),
    parentJti: text("parent_jti").unique(),
    isRevoked: timestamp("is_revoked"),
    expiredAt: timestamp("expired_at").notNull(),
    createdAt: timestamp("created_at").notNull(),
});

export type getOneUserType = typeof users.$inferSelect;
export type insertUserType = typeof users.$inferInsert;
export type safeUserType = z.infer<typeof safeSelectUserSchema>;

export const insertRefreshSchema = createInsertSchema(refresh_tokens);
export const selectRefreshSchema = createSelectSchema(refresh_tokens);

export type insertTokenType = typeof refresh_tokens.$inferInsert;
export type selectTokenType = typeof refresh_tokens.$inferSelect;