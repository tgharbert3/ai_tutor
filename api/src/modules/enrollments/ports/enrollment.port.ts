import type { Enrollment } from "../domain/types.js";

export interface EnrollmentRepoPort {
    fetchEnrollments: (userId: string) => Promise<Enrollment>[];
}