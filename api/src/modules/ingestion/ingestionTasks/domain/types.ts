import type { CanvasCourse } from "@/infrastructure/canvas/types.js";
import type { ingestionTaskEntityType, ingestionTaskKind, ingestionTaskStatus } from "@/infrastructure/db/schema.js";

export type IngestionTaskStatus = (typeof ingestionTaskStatus.enumValues)[number];
export type IngestionTaskET = (typeof ingestionTaskEntityType.enumValues)[number];
export type IngestionTaskKind = (typeof ingestionTaskKind.enumValues)[number];

export interface IngestionTask {
    status: IngestionTaskStatus;
    entityType: IngestionTaskET;
    taskId: string;
    kind: IngestionTaskKind;
    entityId: string;
    schoolId: number;
    canvasCourseId: number;
}

export interface SanitizedSyllabus {
    syllabusId: string;
    sanitizedSyllabus: string;
    plainText: string;
    syllabusHash: string;
}

export type Payload = SanitizedSyllabus | CanvasCourse;

export interface Counts {
    queuedCount: number;
    successCount: number;
    runningCount: number;
    failedCount: number;
    noopCount: number;
}