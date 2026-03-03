export interface CoursesRepositoryPort {
    findAllCourseIdsForSchool: (schoolId: number) => Promise<number[]>;
}