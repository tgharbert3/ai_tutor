import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { insertUserType } from "@/db/schema.js";
import type { registerDtoType } from "@/lib/dto.js";

import app from "@/app.js";
import { createTestApp } from "@/lib/create-app.js";

import { PasswordService } from "../services/password.service.js";
import * as UserRepo from "../user/user.repo.js";

describe("unit tests for router and controllers", () => {
    beforeAll(async () => {
        execSync(`bunx drizzle-kit push`);
    });

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
    });
    const client = testClient(createTestApp(app));
    it("pOST /register - should return the user that was created", async () => {
        const userTorRegister: registerDtoType = {
            email: "testUser",
            username: "testUsername",
            password: "hasedPass",
            canvasToken: "testToken",
        };

        const response = await client.api.v1.register.$post({
            json: userTorRegister,
        });
        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data.email).toBe(userTorRegister.email);
        expect(data.id).toBeDefined();

        const safeInsertedUser = {
            id: data.id,
            email: "testUser",
            username: "testUsername",
            canvasToken: "testToken",
        };
        expect(data).toMatchObject(safeInsertedUser);
        expect(data).not.toHaveProperty("passwordHash");

        const users = await UserRepo.findOneUserById(data.id);
        expect(users).toMatchObject(safeInsertedUser);
    });

    it("pOST /login - Should return the user that was logged in", async () => {
        const insertedUser: insertUserType = {
            id: 2,
            email: "insertedUser@email.com",
            username: "testUser",
            passwordHash: await PasswordService.hashPassword("hashedPassword"),
            canvasToken: "testToken",
        };

        await UserRepo.insertOneUser(insertedUser);
        const response = await client.api.v1.login.$post({
            json: {
                email: insertedUser.email,
                password: "hashedPassword",
            },
        });
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.id).toBeDefined();
        const safeLoggedInUser = {
            id: data.id,
            email: "insertedUser@email.com",
            username: "testUser",
            canvasToken: "testToken",
        };
        expect(data).toMatchObject(safeLoggedInUser);
        expect(data).not.toHaveProperty("passwordHash");
    });
});
