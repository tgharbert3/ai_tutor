/**
 * Funnction to find if course exists in the local db
 * @param localCourseIds CourseIds from the local db. Set<number>
 * @param userEnrollmentCourseIds Course id to find
 * @returns boolean
 */
export function courseExistsInLocalDb(localCourseIds: Set<number>, courseId: number) {
    return localCourseIds.has(courseId);
}