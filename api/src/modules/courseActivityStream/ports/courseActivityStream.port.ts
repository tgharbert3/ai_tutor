export interface CourseActivityStreamRepositoryPort {
    findMostRecentStreamItemId: (courseId: number) => Promise<number>;
}