import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const courses = sqliteTable("users", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    courseId: integer("courseId").notNull().unique(),
    courseName: text("courseName").notNull().default(""),
    courseCode: text("courseCode").notNull().default(""),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const selectCourseSchema = createSelectSchema(courses)
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    });
export const insertCourseSchema = createInsertSchema(
    courses,
    {
        courseId: schema => schema.min(1),
    },
)
    .omit({
        id: true,
    });

export type getCourses = typeof courses.$inferSelect;
export type insertCourseType = typeof courses.$inferInsert;
