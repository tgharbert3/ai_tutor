import type { CanvasTab } from "../../canvas/types.js";
import type { CourseInfo, FullCourseInfo, InsertCourseInfo } from "../../domain/types.js";

export interface ICourseInfoRepository {
    upsertCourseInfo: (courseCode: string, name: string, canvasCourseId: number, rawSyllabus: string, tabs: CanvasTab[], courseId: number) => Promise<InsertCourseInfo>;
    fetchRawSyllabus: (syllabusId: string) => Promise<string>;
    insertSyllabus: (syllabusId: string, sanitizedSyllabus: string, plainText: string, syllabusHash: string) => Promise<void>;
    getAllCourseInfo: (courseId: number) => Promise<FullCourseInfo>;
    getCourseInfoByCourseId: (courseId: number) => Promise<CourseInfo>;
    getCourseTabs: (courseId: number) => Promise<string[]>;
}