import type { CanvasTab } from "../../canvas/types.js";
import type { InsertCourseInfo } from "../../domain/types.js";

export interface ICourseInfoRepository {
    insertCourseInfo: (courseCode: string, name: string, courseId: number, rawSyllabus: string, tabs: CanvasTab[]) => Promise<InsertCourseInfo>;
    fetchRawSyllabus: (syllabusId: string) => Promise<string>;
}