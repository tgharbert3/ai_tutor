import type { ingestionStatusEnum, insertIngestonRun } from "@/infrastructure/db/schema.js";

export type ingestionStatus = (typeof ingestionStatusEnum.enumValues)[number];

export interface InsertIngestionRunPort {
    status: ingestionStatus;
    userId: string;
    schoolId: number;
}

export interface StartIngestionResult {
    ingestionId: string;
    status: ingestionStatus;
    userId: string;
    schoolId: number;
}

// drizzle types

export type InsertIngestion = Pick<insertIngestonRun, "status" | "userId" | "schoolId">;