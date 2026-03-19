import { makeMockCourseInfo, makeMockUserEnrollmentRepo } from "@/modules/tests/mockingFactory.js";

export type mockGetCourseInfoForDashboardDeps = ReturnType<typeof mockGetCourseInfoForDashboardDeps>;
export function mockGetCourseInfoForDashboardDeps() {
    return {
        enrollmentsRepo: makeMockUserEnrollmentRepo(),
        courseInfoRepo: makeMockCourseInfo(),
    };
}