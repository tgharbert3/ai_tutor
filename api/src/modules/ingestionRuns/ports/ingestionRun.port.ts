import type { CanvasClientDeps, ingestionStatus, InsertIngestionRunPort, StartIngestionResult } from "../types.js";

export interface IngestionRunPort {
    create: (newIngestionRun: InsertIngestionRunPort) => Promise<StartIngestionResult>;
    updateRunStatus: (newStatus: ingestionStatus, inngestionId: string) => Promise<void>;
    fetchUserId: (ingestionRunId: string) => Promise<string>;
    fetchCanvasBaseUrl: (ingestionRunId: string) => Promise<string>;
    fetchUserIdAndUrl: (ingestionRunId: string, schoolId: number) => Promise<CanvasClientDeps>;
}