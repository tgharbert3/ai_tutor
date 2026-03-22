import { makeMockCourseInfo, makeMockUserEnrollmentRepo } from "@/modules/tests/mockingFactory.js";

export type mockGetCourseTabsDeps = ReturnType<typeof mockGetCourseTabsDeps>;
export function mockGetCourseTabsDeps() {
    return {
        enrollmentsRepo: makeMockUserEnrollmentRepo(),
        courseInfoRepo: makeMockCourseInfo(),
    };
}