import type { insertCourseType } from "@/db/schema";
import type { CanvasCourse } from "@/lib/types";

function canvasToDb(rawcourses: CanvasCourse): insertCourseType {
  return {
    courseId: rawcourses.id,
    courseName: rawcourses.name || "",
    courseCode: rawcourses.course_code || "",
  };
}

export function mapCoursesToDb(courses: CanvasCourse[]) {
  return courses.map(canvasToDb);
}
