import type { CanvasApiPort } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { insertSchools } from "@/infrastructure/db/schema.js";

import type { SchoolRepositoryPort } from "../ports/school.repo.port.js";

export interface InsertSchool {
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
    canvasClient: CanvasApiPort;
    canvasBaseUrl: string;
}

// Drizzle Types

export type UpsertSchoolInput = Omit<insertSchools, "created_at" | "updated_at">;