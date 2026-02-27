import type { PartialRun, StartIngestionResult } from "../types.js";

export interface IngestionRunPort {
    create: (newIngestionRun: PartialRun) => Promise<StartIngestionResult>;
}