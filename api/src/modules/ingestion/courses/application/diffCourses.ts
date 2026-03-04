/**
 * Funnction to find if course exists in the local db
 * @param localCourseIds CourseIds from the local db. Set<number>
 * @param courseId Course id to find
 * @returns boolean
 */
export function determineCourseExistsInLocalDb(localCourseIds: Set<number>, courseId: number) {
    return localCourseIds.has(courseId);
}