export interface ICoursesRepository {
    findAllCourseIdsForSchool: (schoolId: number) => Promise<number[]>;
}