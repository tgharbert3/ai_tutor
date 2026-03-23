import { makeMockCourseInfo, makeMockUserEnrollmentRepo } from "@/modules/tests/mockingFactory.js";

export type mockGetCourseSyllabusDeps = ReturnType<typeof mockGetCourseSyllabusDeps>;
export function mockGetCourseSyllabusDeps() {
    return {
        enrollmentsRepo: makeMockUserEnrollmentRepo(),
        courseInfoRepo: makeMockCourseInfo(),
    };
}