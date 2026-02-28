export interface EnrollmentRepoPort {
    fetchEnrollments: (userId: string) => Promise<void>;
}