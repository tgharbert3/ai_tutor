export interface EnrollmentQueuePort {
    enqueueEnrollmentFlow: (data: { ingestionId: string; userId: string; canvasBaseUrl: string }) => Promise<void>;
}