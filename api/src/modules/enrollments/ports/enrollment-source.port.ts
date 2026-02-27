import type { Enrollment } from "../domain/types.js";

export interface EnrollmentSourcePort {
    fetchEnrollments: (userId: string) => Promise<Enrollment>[];
}