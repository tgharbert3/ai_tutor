import type { insertUserEnrollment } from "@/infrastructure/db/schema.js";

export interface IEnrollmentRepo {
    fetchEnrollments: (userId: string) => Promise<void>;
    findAllActiveEnrollmentIds: (userId: string) => Promise<number[]>;
    setActiveToFalse: (userId: string, canvasId: number[]) => Promise<void>;
    upsertEnrollment: (enrollments: insertUserEnrollment) => Promise<void>;
}