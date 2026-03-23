import { beforeEach, describe, expect, it } from "vitest";

import { GetCourseSyllabus } from "@/modules/courses/useCases/getCourseSyllabus.js";

import { mockGetCourseSyllabusDeps } from "./setup.js";

describe("unit tests for courseTabs use case", () => {
    let getCourseSyllabus: GetCourseSyllabus;
    let mockDeps: mockGetCourseSyllabusDeps;

    beforeEach(() => {
        mockDeps = mockGetCourseSyllabusDeps();
    });

    it("should return the sanitized syllabus", async () => {
        const userId = "1";
        const canvasCourseId = 1;
        const courseId = 1;
        mockDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId.mockResolvedValue(courseId);
        mockDeps.courseInfoRepo.getCourseSyllabus.mockResolvedValue("<p>This is the syllabus</p>");

        getCourseSyllabus = new GetCourseSyllabus(mockDeps);
        const syllabus = await getCourseSyllabus.execute(userId, canvasCourseId);

        expect(syllabus).toBeDefined();
        expect(mockDeps.enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId).toHaveBeenCalledExactlyOnceWith(userId, canvasCourseId);
        expect(mockDeps.courseInfoRepo.getCourseSyllabus).toHaveBeenCalledExactlyOnceWith(courseId);
    });
});