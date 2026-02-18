import { beforeEach, describe, expect, it } from "vitest";

import env from "@/env.js";
import { createTestDb } from "@/lib/test.utils.js";

import { CourseRepository } from "./courses.repo.js";
import { CourseService } from "./courses.service.js";

describe("user Routes", () => {
    let courseRepo: CourseRepository;

    beforeEach(async () => {
        const db = await createTestDb();

        courseRepo = new CourseRepository(db);
    });

    it("should return an array of courses", async () => {
        const courseInstance = new CourseService(courseRepo, env.API_TOKEN, env.CANVAS_BASE_URL);
        const response = await courseInstance.syncCourses();
        expect(response).toBeInstanceOf(Array);

        const coursesFromDb = await courseRepo.findAllCourses();
        expect(coursesFromDb).toBeInstanceOf(Array);
    });
});