import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

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

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
    });
    const client = testClient(createTestApp(app));
    it("POST /register - should return the user that was created", async () => {
        const userTorRegister: registerDtoType = {
            email: "register@email.com",
            username: "testUsername",
            password: "hashedPassword",
            canvasToken: "testToken",
        };

        const response = await client.api.v1.register.$post({
            json: userTorRegister,
        });
        expect(response.status).toBe(201);
        if (response.status === 201) {
            const data = await response.json();
            expect(data.email).toBe(userTorRegister.email);
            expect(data.id).toBeDefined();

            const safeInsertedUser = {
                id: data.id,
                email: "register@email.com",
                username: "testUsername",
                canvasToken: "testToken",
            };
            expect(data).toMatchObject(safeInsertedUser);
            expect(data).not.toHaveProperty("passwordHash");

            const users = await UserRepo.findOneUserById(data.id);
            expect(users).toMatchObject(safeInsertedUser);
        }
    });

    it("POST /login - Should return the user that was logged in", async () => {
        const password = "hashedPassword";
        const hashedPassword = await PasswordService.hashPassword(password);
        const insertedUser: insertUserType = {
            id: 2,
            email: "login@example.com",
            username: "testUser",
            passwordHash: hashedPassword,
            canvasToken: "testToken",
        };

        await UserRepo.insertOneUser(insertedUser);
        const response = await client.api.v1.login.$post({
            json: {
                email: insertedUser.email,
                password,
            },
        });
        expect(response.status).toBe(200);
        if (response.status === 200) {
            const data = await response.json();
            expect(data.id).toBeDefined();
            const safeLoggedInUser = {
                id: data.id,
                email: "login@example.com",
                username: "testUser",
                canvasToken: "testToken",
            };
            expect(data).toMatchObject(safeLoggedInUser);
            expect(data).not.toHaveProperty("passwordHash");
        }
    });
});
