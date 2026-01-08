import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const courses = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  courseName: text("courseName"),
  courseCode: text("courseCode"),
});

export const selectCourseSchema = createSelectSchema(courses);
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
export type insertOneCourseType = typeof courses.$inferInsert;
