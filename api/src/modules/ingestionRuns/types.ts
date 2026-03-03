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

export interface Handoff {
    canvasBaseUrl: string;
    ingestionId: string;
    status: ingestionStatus;
    userId: string;
    schoolId: number;
}

export interface CanvasClientDeps {
    userId: string;
    canvasBaseUrl: string;
}

// drizzle types

export type InsertIngestion = Pick<insertIngestonRun, "status" | "userId" | "schoolId">;