import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { safeUserType } from "@/db/schema.js";
import type { registerDtoType } from "@/lib/dto.js";

import app from "@/app.js";
import { createTestApp } from "@/lib/create-app.js";

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

        const safeInsertedUser: safeUserType = {
            id: 1,
            email: "testUser",
            username: "testUsername",
            canvasToken: "testToken",
        };
        const response = await client.api.v1.register.$post({
            json: userTorRegister,
        });
        expect(response.status).toBe(201);

        const data = await response.json();
        expect(data.email).toBe(userTorRegister.email);
        expect(data.id).toBeDefined();
        expect(data).toMatchObject(safeInsertedUser);
        expect(data).not.toHaveProperty("passwordHash");

        const users = await UserRepo.findOneUserById(data.id);
        expect(users).toMatchObject(safeInsertedUser);
    });
});
