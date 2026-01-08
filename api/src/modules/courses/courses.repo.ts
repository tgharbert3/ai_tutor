import type { insertOneCourseType } from "@/db/schema";

import db from "@/db";
import { courses } from "@/db/schema";

export async function insertOneCourse(course: insertOneCourseType) {
  const [inserted] = await db.insert(courses).values(course).returning();

  return inserted;
}
