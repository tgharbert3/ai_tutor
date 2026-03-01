import type { CanvasApiPort } from "@/infrastructure/canvas/ports/cavans.api.port.js";

export interface FetchCanvasEnrollmentsDeps {
    canvasClient: CanvasApiPort;
    canvasBaseUrl: string;
}

export interface SetDifference {
    added: Set<number>;
    dropped: Set<number>;
}