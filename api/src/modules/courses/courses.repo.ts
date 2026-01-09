import { sql } from "drizzle-orm";

import type { insertCourseType } from "@/db/schema";

import db from "@/db";
import { courses } from "@/db/schema";

export async function upsertManyCourses(course: insertCourseType[]) {
    const inserted = await db.insert(courses).values(course).returning().onConflictDoUpdate({
        target: courses.courseId,
        set: {
            updatedAt: new Date(),
            courseCode: sql`excluded.course_code`,
            courseName: sql`excluded.course_name`,
        },
    });
    return inserted;
}

export async function findAllCourses() {
    const response = await db.select({
        courseId: courses.courseId,
        courseName: courses.courseName,
        courseCode: courses.courseCode,
    }).from(courses);
    return response;
}
