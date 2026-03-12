export interface InsertCourseInfo {
    courseInfoId: string;
    syllabusId: string;
}

export interface FullCourseInfo {
    course_info: {
        id: string;
        courseCode: string;
        name: string;
        canvasCourseId: number;
        courseId: number | null;
    } | null;
    course_syllabus: {
        id: string;
        sanitizedSyllabus: string | null;
        rawSyllabus: string;
        plainText: string | null;
        hash: string | null;
        status: "queued" | "running" | "noop" | "complete" | "failed";
        courseInfoId: string;
    } | null;
    course_tabs: {
        id: string;
        tabId: string;
        courseInfoId: string;
    };
}