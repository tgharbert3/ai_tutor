import type { CanvasApiPort } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { insertUser } from "@/infrastructure/db/schema.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/repos/ingestionRun.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/repos/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/repos/user.repo.interface.js";

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
    userRepo: IUserRepository;
    userId: string;
    email: string;
    schoolRepo: ISchoolRepository;
    canvasClient: CanvasApiPort;
    canvasBaseUrl: string;
    ingestionRunRepo: IIngestionRunRepository;
}

// Drizzle types

export type InsertUserInput = Omit<insertUser, "created_at" | "updated_at">;