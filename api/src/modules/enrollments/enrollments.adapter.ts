import type { Enrollment } from "@/lib/types.js";

export function canvasEnrollmentToDbEnrollment(rawEnrollment: Enrollment) {
    return {
        canvasUserId: rawEnrollment.canvasUserId,
        courseId: rawEnrollment.canvasCourseId,
        enrollmentState: rawEnrollment.enrollmentState,
    };
}

export function mapEnrollmentsToDb(userEnrollmets: Enrollment[]) {
    return userEnrollmets.map(canvasEnrollmentToDbEnrollment);
}