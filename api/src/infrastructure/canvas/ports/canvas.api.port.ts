import type { CanvasCourse, CanvasEnrollment, StreamActivityItem } from "../types.js";

export interface CanvasApiPort {
    getPrimaryColor: () => Promise<string | undefined>;
    getCanvasEnrollments: () => Promise<CanvasEnrollment[] | undefined>;
    getCanvasCourseActivityStream: (courseId: number) => Promise<StreamActivityItem[] | undefined>;
    getCourseInfo: (courseId: number) => Promise<CanvasCourse | undefined>;
}

export interface CanvasApiPortFactory {
    create: (deps: {
        apiToken: string;
        canvasBaseUrl: string;
    }) => CanvasApiPort;
}