import type { db } from "@/lib/types.js";

import { ingestionRuns } from "@/infrastructure/db/schema.js";

import type { IngestionRunPort } from "../ports/ingestionRun.port.js";
import type { PartialRun, StartIngestionResult } from "../types.js";

export class DrizzleIngestionRunRepository implements IngestionRunPort {
    constructor(private readonly db: db) {};

    async create(newIngestionRun: PartialRun): Promise<StartIngestionResult> {
        const [newRun] = await this.db.insert(ingestionRuns).values(newIngestionRun).returning();
        return {
            ingestionId: newRun.id,
            status: newRun.status,
        };
    }
}