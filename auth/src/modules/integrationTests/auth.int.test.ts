import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { registerDtoType } from "@/lib/dto.js";

import app from "@/app.js";
import { createTestApp } from "@/lib/create-app.js";
import { PasswordService } from "../services/password.service.js";
import { insertUserType } from "@/db/schema.js";

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
    
    it("POST /register - should return the Object with message property and set cookies", async () => {
        const userTorRegister: registerDtoType = {
            email: "register@email.com",
            username: "testUsername",
            password: "hashedPassword",
            canvasToken: "testToken",
            canvasBaseUrl: "https://uncw.infrastructure.edu"
        };
        const response = await client.api.v1.register.$post({
            json: userTorRegister,
        });

        expect (response.status).toBe(201);
        // If for type completion. Could be 500 status
        if (response.status === 201) {
            const data = await response.json();
            expect(data).toMatchObject({message: "Successfully registered"})
            const cookies = response.headers.getSetCookie();
            const at = cookies.find(c => c.includes("__Host-at"));
            const rt = cookies.find(c => c.includes("__Host-rt"));

            expect(at).toBeDefined();
            expect(at).toContain("HttpOnly");
            expect(at).toContain("Secure");
            expect(at).toContain("SameSite=Lax");

            expect(rt).toBeDefined();
            expect(rt).toContain("HttpOnly");
            expect(rt).toContain("Secure");
            expect(rt).toContain("SameSite=Lax");
    }});

    it("POST /login - Should return the user that was logged in, and then logout that user", async () => {
        const password = "hashedPassword";
        const hashedPassword = await PasswordService.hashPassword(password);
        const insertedUser: insertUserType = {
            id: 'u-u-i-d',
            email: "login@example.com",
            username: "testUser",
            passwordHash: hashedPassword,
            canvasToken: "testToken",
            canvasBaseUrl: "https://uncw.infrastructure.edu"
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
            expect(data).toMatchObject({message: "Successfully logged in"})
            const cookies = response.headers.getSetCookie();
            const at = cookies.find(c => c.includes("__Host-at"));
            const rt = cookies.find(c => c.includes("__Host-rt"));

            expect(at).toBeDefined();
            expect(rt).toBeDefined();

            const rtCookieValue = rt?.split(";")[0];
            const noReponse = await client.api.v1.logout.$post({}, {
                headers: {
                    "Cookie": rtCookieValue || "",
                }
            });
            expect(noReponse.status).toBe(204);
            const emptyCookies = noReponse.headers.getSetCookie();
            expect(emptyCookies.length).toBe(2);

            const deletedAt = emptyCookies.find(c => c.includes("__Host-at"));
            expect(deletedAt).toMatch("__Host-at=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax")

            const deletedRt = emptyCookies.find(c => c.includes("__Host-rt"));
            expect(deletedRt).toMatch("__Host-rt=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax")
        };
    });

    it("POST /refresh - Should refresh the cookies", async () => {
        vi.useFakeTimers();

        const password = "hashedPassword";
        const hashedPassword = await PasswordService.hashPassword(password);
        const insertedUser: insertUserType = {
            id: "u-u-i-d",
            email: "login3@example.com",
            username: "testUser",
            passwordHash: hashedPassword,
            canvasToken: "testToken",
            canvasBaseUrl: "https://uncw.infrastructure.edu"
        };

        await UserRepo.insertOneUser(insertedUser);
        const response = await client.api.v1.login.$post({
            json: {
                email: insertedUser.email,
                password,
            },
        });

        // Make sure the cookies were set after the user logs in
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toMatchObject({message: "Successfully logged in"})
        const cookies = response.headers.getSetCookie();
        const at = cookies.find(c => c.includes("__Host-at"));
        const rt = cookies.find(c => c.includes("__Host-rt"));
        expect(at).toBeDefined();
        expect(rt).toBeDefined();

        // advance the time by 16 min to expire cookie
        vi.advanceTimersByTime(16 * 60 * 1000);

        // Start the refresh process
        const rtCookieValue = rt?.split(";")[0];
        const refreshResponse = await client.api.v1.refresh.$post({}, {
            headers: {
                "Cookie": rtCookieValue || "",
            }
        });

        // check the new cookies
        expect (refreshResponse.status).toBe(200);
        const newData = await refreshResponse.json()
        expect(newData).toMatchObject({ message: 'Successfully refreshed cookies' });
        const newCookies = refreshResponse.headers.getSetCookie();
        const newRt = newCookies.find(c => c.includes("__Host-rt"));
        const newAt = newCookies.find(c => c.includes("__Host-at"));
        expect(at).not.toMatch(newAt!);
        expect(rt).not.toMatch(newRt!);

        vi.useRealTimers();
    });

    // it("Should return an object of validation errors", async () => {
    //     // Failing all validations
    //     const response = await client.api.v1.register.$post({
    //         json: {
    //             email: "",
    //             password: "",
    //             username: "",
    //             canvasToken: "",
    //         }
    //     })
    //     if (response.status === 400) {
    //         const data = await response.json();
    //         expect(data).toBeInstanceOf(Object);
    //         expect(data).toHaveProperty("errors");
    //         expect(data.errors).toBeInstanceOf(Object);
    //         expect(data.errors).toHaveProperty("email")
    //         expect(data.errors).toHaveProperty("password")
    //         expect(data.errors).toHaveProperty("username")
    //         expect(data.errors).toHaveProperty("canvasToken")
    //     };
    // });

    // it("POST Should return a object with error property", async () => {
    //     const response = await client.api.v1.login.$post({
    //         json: {
    //             email: "",
    //             password: "",
    //         }
    //     })
    //      if (response.status === 400) {
    //         const data = await response.json();
    //         expect(data).toBeInstanceOf(Object);
    //         expect(data).toHaveProperty("error");
    //         expect(data.error).toMatch("Invalid email or password");
    //      };
    // });
});
