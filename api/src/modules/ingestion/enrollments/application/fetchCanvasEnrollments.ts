import type { CanvasEnrollment } from "@/infrastructure/canvas/types.js";

import type { FetchCanvasEnrollmentsDeps } from "../types.js";

export class FetchCanvasEnrollments {
    constructor(private deps: FetchCanvasEnrollmentsDeps) {};

    async execute(): Promise<CanvasEnrollment[]> {
        const canvasEnrollments = await this.deps.canvasClient.getCanvasEnrollments();
        // Handle this error better
        if (!canvasEnrollments) {
            throw new Error("Unable to fetch enrollments from cavas");
        }
        return canvasEnrollments;
    };
}