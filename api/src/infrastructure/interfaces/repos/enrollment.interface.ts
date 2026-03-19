import type { getUserEnrollments, insertUserEnrollment } from "@/infrastructure/db/schema.js";

export interface IEnrollmentRepo {
    findAllActiveEnrollmentIds: (userId: string) => Promise<number[]>;
    setActiveToFalse: (userId: string, canvasId: number[]) => Promise<void>;
    upsertEnrollment: (enrollments: insertUserEnrollment) => Promise<getUserEnrollments>;
    getCourseIdsByUserId: (userId: string) => Promise<number[]>;
}