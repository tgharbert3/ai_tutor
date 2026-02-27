import type { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";

import type { EnrollmentSourcePort } from "../ports/enrollment-source.port.js";

export class CanvasEnrollmentSource implements EnrollmentSourcePort {
    constructor(
        private readonly canvas: CanvasClient,
    ) {};

    async fetchEnrollments() {

    }
}