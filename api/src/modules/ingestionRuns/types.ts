import type { ingestionStatusEnum } from "@/infrastructure/db/schema.js";

export type ingestionStatus = (typeof ingestionStatusEnum.enumValues)[number];

export interface PartialRun {
    status: ingestionStatus;
    userId: string;
    schoolId: number;
}

export interface StartIngestionResult {
    ingestionId: string;
    status: ingestionStatus;
    userId: string;
    schoolId: number;
}