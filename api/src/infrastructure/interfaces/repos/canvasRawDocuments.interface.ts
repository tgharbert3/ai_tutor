import type { IngestionTaskET } from "@/modules/ingestion/ingestionTasks/domain/types.js";

import type { getCanvasRawDocument } from "../../db/schema.js";

export interface ICanvasRawDocumentsRepository {
    insertCanvasRawDocument: (
        entityType: IngestionTaskET,
        entityId: string,
        payload: string,
        fetchAt: Date,
        courseId: number,
        schoolId: number)
    => Promise<string>;

    fetchRawDocument: (docId: string) => Promise<Omit<getCanvasRawDocument, "fetchedAt">>;
}