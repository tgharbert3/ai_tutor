import type { CanvasEnrollment } from "@/infrastructure/canvas/types.js";

import type { FetchCanvasEnrollmentsDeps } from "../types.js";

export class FetchCanvasEnrollments {
    constructor(deps: FetchCanvasEnrollmentsDeps) {};

    async execute(): Promise<CanvasEnrollment[]>;
}