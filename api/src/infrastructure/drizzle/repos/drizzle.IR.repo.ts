import { eq } from "drizzle-orm";

import type { IIngestionRun } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { db } from "@/lib/types.js";

import { ingestionRuns, schools } from "@/infrastructure/db/schema.js";

import type { ingestionStatus, InsertIngestion, StartIngestionResult } from "../../../modules/ingestion/ingestionRuns/domain/types.js";

export class DrizzleIngestionRunRepository implements IIngestionRun {
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

    async fetchUserId(ingestionRunId: string) {
        const [run] = await this.db.select().from(ingestionRuns).where(eq(ingestionRuns.id, ingestionRunId));
        return run.userId;
    }

    async fetchCanvasBaseUrl(ingestionRunId: string) {
        const run = await this.db.query.ingestionRuns.findFirst(
            {
                with: {
                    schools: true,
                },
                where: eq(ingestionRuns.id, ingestionRunId),
            },
        );

        return run!.schools.canvasBaseUrl;
    }

    async fetchUserIdAndUrl(ingestionRunId: string, schoolId: number) {
        const [run] = await this.db.select().from(ingestionRuns).where(eq(ingestionRuns.id, ingestionRunId)).rightJoin(schools, eq(schools.id, schoolId));

        return { userId: run.ingestion_runs!.userId, canvasBaseUrl: run.schools.canvasBaseUrl };
    }
}