import { beforeEach, describe, expect, it } from "vitest";

import { GetCourseTabs } from "@/modules/courses/useCases/getCourseTabs.js";

import { mockGetCourseTabsDeps } from "./setup.js";

describe("unit tests for courseTabs use case", () => {
    let getCourseTabs: GetCourseTabs;
    let mockDeps: mockGetCourseTabsDeps;

    beforeEach(() => {
        mockDeps = mockGetCourseTabsDeps();
    });

    it("should return an array of tabIds", async () => {
        const userId = "user1";
        const canvasCourseId = 12345;
        const courseId = 1;
        mockDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId.mockResolvedValue(courseId);
        mockDeps.courseInfoRepo.getCourseTabs.mockResolvedValue(["syllabus", "assignments"]);

        getCourseTabs = new GetCourseTabs(mockDeps);
        const courseTabs = await getCourseTabs.execute(userId, canvasCourseId);

        expect(mockDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId).toHaveBeenCalledExactlyOnceWith(userId, canvasCourseId);
        expect(mockDeps.courseInfoRepo.getCourseTabs).toHaveBeenCalledExactlyOnceWith(courseId);
        expect(courseTabs).toBeDefined();
    });
});