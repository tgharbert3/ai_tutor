import type { CanvasClientDeps, ingestionStatus, InsertIngestionRunPort, StartIngestionResult } from "@/modules/ingestion/ingestionRuns/domain/types.js";

export interface IIngestionRun {
    create: (newIngestionRun: InsertIngestionRunPort) => Promise<StartIngestionResult>;
    updateRunStatus: (newStatus: ingestionStatus, inngestionId: string) => Promise<void>;
    fetchUserId: (ingestionRunId: string) => Promise<string>;
    fetchCanvasBaseUrl: (ingestionRunId: string) => Promise<string>;
    fetchUserIdAndUrl: (ingestionRunId: string, schoolId: number) => Promise<CanvasClientDeps>;
}