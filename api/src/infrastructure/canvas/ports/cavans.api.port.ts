import type { CanvasEnrollment } from "../types.js";

export interface CanvasApiPort {
    getPrimaryColor: () => Promise<string | undefined>;
    getCanvasEnrollments: () => Promise<CanvasEnrollment[] | undefined>;
}

export interface CanvasApiPortFactory {
    create: (deps: {
        apiToken: string;
        canvasBaseUrl: string;
    }) => CanvasApiPort;
}