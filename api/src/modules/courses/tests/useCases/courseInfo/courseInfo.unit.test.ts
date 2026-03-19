import { beforeEach, describe, expect, it } from "vitest";

import { GetCourseInfoForDashboard } from "@/modules/courses/useCases/getCourseInfoForDashboard.js";

import { mockGetCourseInfoForDashboardDeps } from "./setup.js";

describe("unit tests for getCourseInfo use case", () => {
    let getCourseInfo: GetCourseInfoForDashboard;
    let mockDeps: mockGetCourseInfoForDashboardDeps;

    beforeEach(() => {
        mockDeps = mockGetCourseInfoForDashboardDeps();
    });

    it("should return the course info for each course", async () => {
        const userId = "1";
        getCourseInfo = new GetCourseInfoForDashboard(mockDeps);
        mockDeps.enrollmentsRepo.getCourseIdsByUserId.mockResolvedValue([2]);

        mockDeps.courseInfoRepo.getCourseInfoByCourseId.mockResolvedValue({
            canvasCourseId: 2,
            name: "course1",
            courseCode: "courseCode",
        });

        const courses = await getCourseInfo.execute(userId);

        expect(mockDeps.enrollmentsRepo.getCourseIdsByUserId).toHaveBeenCalledExactlyOnceWith("1");
        expect(mockDeps.courseInfoRepo.getCourseInfoByCourseId).toHaveBeenCalledExactlyOnceWith(2);
        expect(courses).toBeDefined();
    });
});