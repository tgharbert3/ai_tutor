import { eq } from "drizzle-orm";

import type { getCanvasRawDocument } from "@/infrastructure/db/schema.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/repos/canvasRawDocuments.interface.js";
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
        canvasCourseId: number,
        schoolId: number,
    ) {
        const doc = {
            entityType,
            entityId,
            payload,
            fetchedAt: fetchAt,
            canvasCourseId,
            schoolId,
        };
        const [newDoc] = await this.db.insert(canvasRawDocuments).values(doc).returning();
        return newDoc.id;
    }

    async fetchRawDocument(docId: string): Promise<Omit<getCanvasRawDocument, "fetchedAt">> {
        const doc = await this.db.query.canvasRawDocuments.findFirst({
            where: eq(canvasRawDocuments.id, docId),
        });
        if (!doc) {
            // TODO: Make this a custom error
            throw new Error(`Document does not exist for id:${docId} `);
        }
        return {
            id: doc.id,
            canvasCourseId: doc.canvasCourseId,
            schoolId: doc.schoolId,
            payload: doc.payload,
            entityType: doc.entityType,
            entityId: doc.entityId,
        };
    }
};