import { eq } from "drizzle-orm";

import type { db } from "@/lib/types.js";

import { ingestionRuns } from "@/infrastructure/db/schema.js";

import type { IngestionRunPort } from "../ports/ingestionRun.port.js";
import type { ingestionStatus, InsertIngestion, StartIngestionResult } from "../types.js";

export class DrizzleIngestionRunRepository implements IngestionRunPort {
    constructor(private readonly db: db) {};

    async create(newIngestionRun: InsertIngestion): Promise<StartIngestionResult> {
        const [newRun] = await this.db.insert(ingestionRuns).values(newIngestionRun).returning();
        return {
            ingestionId: newRun.id,
            status: newRun.status,
            schoolId: newRun.schoolId,
            userId: newRun.userId,
        };
    }

    async updateRunStatus(newStatus: ingestionStatus, ingestionId: string): Promise<void> {
        await this.db.update(ingestionRuns).set({ status: newStatus }).where(eq(ingestionRuns.id, ingestionId));
    }
}