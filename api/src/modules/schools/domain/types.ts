import type { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";

import type { SchoolRepositoryPort } from "../ports/school.repo.port.js";

export interface PartialSchool {
    canvasBaseUrl: string;
    schoolColor?: string;
}

export interface SchoolDto {
    schoolId: number;
    canvasBaseUrl: string;
    schoolColor: string;
}

export interface EnsureSchoolExistsDeps {
    schoolRepo: SchoolRepositoryPort;
    canvasClient: CanvasClient;
    canvasBaseUrl: string;
}