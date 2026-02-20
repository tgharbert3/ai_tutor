import { beforeEach, describe, expect, it } from "vitest";

import type { insertSchools } from "@/db/schema.js";
import type { JWTData } from "@/lib/types.js";

import env from "@/env.js";
import { createTestDb } from "@/lib/test.utils.js";

import { SchoolRepository } from "../schools/school.repo.js";
import { SchoolService } from "../schools/school.service.js";
import { UserRepository } from "../users/user.repo.js";
import { UserService } from "../users/user.service.js";

describe("user Routes", () => {
    let userRepo: UserRepository;
    let schoolRepo: SchoolRepository;

    beforeEach(async () => {
        const db = await createTestDb();

        userRepo = new UserRepository(db);
        schoolRepo = new SchoolRepository(db);
    });

    // Tests the path where there is not a user but there is a school
    it("should return school color and user id", async () => {
        const data: JWTData = {
            userId: crypto.randomUUID(),
            email: "tgh1432@uncw.edu",
            fullurl: env.CANVAS_BASE_URL,
            canvasToken: env.API_TOKEN,
        };

        const testSchool: insertSchools = {
            canvasBaseUrl: env.CANVAS_BASE_URL,
            schoolColor: "TestColor",
            created_at: new Date(),
            updated_at: new Date(),
        };
        const savedSchools = await schoolRepo.upsertSchool(testSchool);

        expect(savedSchools).toBeDefined();
        const schoolService = new SchoolService(schoolRepo, env.API_TOKEN, env.CANVAS_BASE_URL);

        const userInstance = new UserService(userRepo, env.API_TOKEN, env.CANVAS_BASE_URL, schoolService);
        const response = await userInstance.syncUserFacade(data);
        console.log(response);
        expect(response).toBeInstanceOf(Object);
    });
});