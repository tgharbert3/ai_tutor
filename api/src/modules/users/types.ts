import type { CanvasClient } from "@/infrastructure/canvas/canvas-client.js";
import type { insertUser } from "@/infrastructure/db/schema.js";

import type { IngestionRunPort } from "../ingestionRuns/ports/ingestionRun.port.js";
import type { SchoolRepositoryPort } from "../schools/ports/school.repo.port.js";
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
    canvasClient: CanvasClient;
    canvasBaseUrl: string;
    ingestionRunRepo: IngestionRunPort;
}

// Drizzle types

export type InsertUserInput = Omit<insertUser, "created_at" | "updated_at">;