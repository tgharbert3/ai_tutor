import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import type { insertUserEnrollment } from "@/infrastructure/db/schema.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";
import type { db } from "@/lib/types.js";

import { getTestDb } from "@/infrastructure/db/testDb.js";

import { DrizzleEnrollmentRepository } from "../drizzle.enrollments.repo.js";
import { RepoTestHelper } from "./helpers.js";

describe("int tests for enrollments repo", () => {
    let db: db;
    let enrollmentsRepo: IEnrollmentRepo;
    let repoTestHelper: RepoTestHelper;
    beforeEach(async () => {
        db = await getTestDb();
        repoTestHelper = new RepoTestHelper(db);
        enrollmentsRepo = new DrizzleEnrollmentRepository(db);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    it("returns course ids for the given user", async () => {
        const testSchool = await repoTestHelper.getTestSchool();
        const testUser = await repoTestHelper.getTestUser();
        const testCourse = await repoTestHelper.getTestCourse();

        await enrollmentsRepo.upsertEnrollment({
            schoolId: testSchool.schoolId,
            canvasCourseId: 1,
            userId: testUser.id,
            courseId: testCourse,
            isActive: true,
        } satisfies insertUserEnrollment);

        const courseIds = await enrollmentsRepo.getCourseIdsByUserId(testUser.id);

        expect(courseIds).toEqual([1]);
    });

    it("returns empty array for a user with no enrollments or no active enrollments", async () => {
        await repoTestHelper.getTestSchool();
        const testUser = await repoTestHelper.getTestUser();
        await repoTestHelper.getTestCourse();

        const courseIds = await enrollmentsRepo.getCourseIdsByUserId(testUser.id);

        expect(courseIds).toEqual([]);
    });

    it("returns a courseId", async () => {
        const testSchool = await repoTestHelper.getTestSchool();
        const testUser = await repoTestHelper.getTestUser();
        const testCourse = await repoTestHelper.getTestCourse();
        const testCanvasCourseId = 1;

        await enrollmentsRepo.upsertEnrollment({
            schoolId: testSchool.schoolId,
            canvasCourseId: testCanvasCourseId,
            userId: testUser.id,
            courseId: testCourse,
            isActive: true,
        });

        const courseId = await enrollmentsRepo.getCourseIdByUserIdAndCanvasCourseId(testUser.id, testCanvasCourseId);

        expect(courseId).toEqual(testCourse);
    });
});