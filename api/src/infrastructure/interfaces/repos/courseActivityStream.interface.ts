export interface ICourseActivityStreamRepository {
    findMostRecentStreamItemId: (courseId: number) => Promise<number>;
}