export interface IEnrollmentRepo {
    fetchEnrollments: (userId: string) => Promise<void>;
    findAllActiveEnrollmentIds: (userId: string) => Promise<number[]>;
    setActiveToFalse: (userId: string, canvasId: number[]) => Promise<void>;
}