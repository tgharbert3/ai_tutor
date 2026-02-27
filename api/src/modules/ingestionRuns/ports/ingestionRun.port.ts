import type { InsertIngestionRunPort, StartIngestionResult } from "../types.js";

export interface IngestionRunPort {
    create: (newIngestionRun: InsertIngestionRunPort) => Promise<StartIngestionResult>;
}