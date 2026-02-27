export interface EnrollmentQueuePort {
    enqueueEnrollmentFlow: (data: { ingestionId: string; userId: string; schoolId: number }) => Promise<void>;
}