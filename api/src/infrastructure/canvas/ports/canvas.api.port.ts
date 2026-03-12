import type { CanvasCourse, CanvasEnrollment, StreamActivityItem } from "../types.js";

export interface CanvasApiPort {
    getPrimaryColor: () => Promise<string | undefined>;
    getCanvasEnrollments: () => Promise<CanvasEnrollment[]>;
    getCanvasCourseActivityStream: (courseId: number) => Promise<StreamActivityItem[]>;
    getCourseInfo: (courseId: number) => Promise<CanvasCourse>;
}

export interface CanvasApiPortFactory {
    create: (deps: {
        apiToken: string;
        canvasBaseUrl: string;
    }) => CanvasApiPort;
}