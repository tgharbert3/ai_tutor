import { beforeEach, describe, expect, it } from "vitest";

import type { insertSchools, insertUser } from "@/db/schema.js";
import type { JWTData } from "@/lib/types.js";

import env from "@/env.js";
import { createTestDb } from "@/lib/test.utils.js";

import { ServiceContainer } from "../services.container.js";

describe("user Routes", () => {
    let serviceContainer: ServiceContainer;

    beforeEach(async () => {
        const db = await createTestDb();

        serviceContainer = new ServiceContainer(db, env.API_TOKEN, env.CANVAS_BASE_URL);
    });

    // Tests the case where there is already a user with school info
    it("should return user and color", async () => {
        // Insert the test school
        const testSchool: insertSchools = {
            canvasBaseUrl: env.CANVAS_BASE_URL,
            schoolColor: "TestColor",
            created_at: new Date(),
            updated_at: new Date(),
        };
        const schoolService = serviceContainer.schoolService;
        const savedSchools = await schoolService.upsertSchool(testSchool);
        expect(savedSchools).toBeDefined();

        // Insert the test user
        const testUser: insertUser = {
            id: crypto.randomUUID(),
            email: "test@gmail.com",
            schoolId: savedSchools[0].id,
            updated_at: new Date(),
            created_at: new Date(),
        };
        const userService = serviceContainer.userService;
        const [savedUser] = await userService.insertUser(testUser);
        expect(savedUser).toBeDefined();

        const data: JWTData = {
            userId: crypto.randomUUID(),
            email: "tgh1432@uncw.edu",
            fullurl: env.CANVAS_BASE_URL,
            canvasToken: env.API_TOKEN,
        };

        const response = await userService.syncUserFacade(data);
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty("userId");
        expect(response).toHaveProperty("schoolColor");
    });

    // Tests the path where there is no school or user
    it("should return school color ", async () => {
        const data: JWTData = {
            userId: crypto.randomUUID(),
            email: "tgh1432@uncw.edu",
            fullurl: env.CANVAS_BASE_URL,
            canvasToken: env.API_TOKEN,
        };

        const userInstance = serviceContainer.userService;
        const response = await userInstance.syncUserFacade(data);
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty("userId");
        expect(response).toHaveProperty("schoolColor");
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
        const schoolService = serviceContainer.schoolService;
        const savedSchools = await schoolService.upsertSchool(testSchool);
        expect(savedSchools).toBeDefined();

        const userInstance = serviceContainer.userService;
        const response = await userInstance.syncUserFacade(data);
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(Object);
        expect(response).toHaveProperty("userId");
        expect(response).toHaveProperty("schoolColor");
    });
});