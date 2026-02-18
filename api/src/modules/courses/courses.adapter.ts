import type { insertCourseType } from "@/db/schema.js";
import type { CanvasCourse } from "@/lib/types.js";

function canvasCourseToDbCourse(rawcourses: CanvasCourse): insertCourseType {
    return {
        courseId: rawcourses.id,
        courseName: rawcourses.name || "",
        courseCode: rawcourses.course_code || "",
    };
}

export function mapCoursesToDb(courses: CanvasCourse[]) {
    return courses.map(canvasCourseToDbCourse);
};