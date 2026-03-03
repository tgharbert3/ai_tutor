import type { ParentRef } from "@/modules/ingestion/domain/types.js";

export interface SyllabusFlowPort {
    enqueueSyllabusFlow: (ingestionId: string, parent: ParentRef, courseId: number) => Promise<void>;
}