import type { ingestionStatus, InsertIngestionRunPort, StartIngestionResult } from "../types.js";

export interface IngestionRunPort {
    create: (newIngestionRun: InsertIngestionRunPort) => Promise<StartIngestionResult>;
    updateRunStatus: (newStatus: ingestionStatus, inngestionId: string) => Promise<void>;
}