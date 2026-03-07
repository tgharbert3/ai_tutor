import type { CanvasApiPort } from "@/infrastructure/canvas/ports/canvas.api.port.js";

export interface Enrollment {
    canvasUserId: number;
    canvasCourseId: number;
    enrollmentState: string;
}

export interface FetchCanvasEnrollmentsDeps {
    canvasClient: CanvasApiPort;
    canvasBaseUrl: string;
}

export interface SetDifference {
    added: Set<number>;
    dropped: Set<number>;
}