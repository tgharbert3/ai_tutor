import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { db } from "@/lib/types.js";

import { getTestDb } from "@/infrastructure/db/testDb.js";

import { DrizzleCourseInfoRepository } from "../drizzle.courseInfo.repo.js";
import { RepoTestHelper } from "./helpers.js";

describe("int tests for courseInfo repo", () => {
    let db: db;
    let courseInfo: ICourseInfoRepository;
    let repoTestHelper: RepoTestHelper;
    beforeEach(async () => {
        db = await getTestDb();
        repoTestHelper = new RepoTestHelper(db);
        courseInfo = new DrizzleCourseInfoRepository(db);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    it("should return a list of courseTabs", async () => {
        await repoTestHelper.getTestSchool();
        await repoTestHelper.getTestUser();
        const courseId = await repoTestHelper.getTestCourse();
        await repoTestHelper.insertCourseInfo(courseId);

        const courseTabs = await courseInfo.getCourseTabs(courseId);

        expect(courseTabs).toMatchObject(["syllabus"]);
    });

    it("should return the sanitized syllabus", async () => {
        await repoTestHelper.getTestSchool();
        await repoTestHelper.getTestUser();
        const courseId = await repoTestHelper.getTestCourse();
        const testCourse = await repoTestHelper.insertCourseInfo(courseId);
        await repoTestHelper.insertCourseSyllabus(testCourse.syllabusId);

        const syllabus = await courseInfo.getCourseSyllabus(courseId);

        expect(syllabus).toEqual("<p>this is the syllabus</p>");
    });
});