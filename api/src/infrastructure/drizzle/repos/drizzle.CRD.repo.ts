import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/canvasRawDocuments.interface.js";
import type { db } from "@/lib/types.js";
import type { IngestionTaskET } from "@/modules/ingestion/ingestionTasks/domain/types.js";

import { canvasRawDocuments } from "@/infrastructure/db/schema.js";

export class DrizzleCanvasRawDocuments implements ICanvasRawDocumentsRepository {
    constructor(private db: db) {}

    async insertCanvasRawDocument(
        entityType: IngestionTaskET,
        entityId: string,
        payload: string,
        fetchAt: Date,
        courseId: number,
        schoolId: number,
    ) {
        const doc = {
            entityType,
            entityId,
            payload,
            fetchAt,
            courseId,
            schoolId,
        };
        const [newDoc] = await this.db.insert(canvasRawDocuments).values(doc).returning();
        return newDoc.id;
    }
};