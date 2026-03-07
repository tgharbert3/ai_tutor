import type { CanvasApiPort } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { insertUser } from "@/infrastructure/db/schema.js";

import type { IngestionRunPort } from "../ingestion/ingestionRuns/ports/ingestionRun.port.js";
import type { SchoolRepositoryPort } from "../ingestion/schools/ports/school.repo.port.js";
import type { UserRepositoryPort } from "./ports/user.repo.port.js";

export interface UserWithSchoolDto {
    id: string;
    email: string;
    schoolId: number;
    school: {
        canvasBaseUrl: string;
        schoolColor: string | null;
    };
}

export interface UserDto {
    id: string;
    email: string;
    schoolId: number;
}

export interface SyncUserDeps {
    userRepo: UserRepositoryPort;
    userId: string;
    email: string;
    schoolRepo: SchoolRepositoryPort;
    canvasClient: CanvasApiPort;
    canvasBaseUrl: string;
    ingestionRunRepo: IngestionRunPort;
}

// Drizzle types

export type InsertUserInput = Omit<insertUser, "created_at" | "updated_at">;