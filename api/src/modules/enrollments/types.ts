import type { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";

export interface FetchCanvasEnrollmentsDeps {
    canvasClient: CanvasClient;
    canvasBaseUrl: string;
}