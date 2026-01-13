import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { getOneUserType, safeUserType } from "@/db/schema.js";

import env from "@/env.js";

import { insertOneUser } from "../user/user.repo.js";
import * as UserRepo from "../user/user.repo.js";

import { AuthService } from "./auth.service.js";
import { HTTPException } from "hono/http-exception";
import { PasswordService } from "../services/password.service.js";

if (env.NODE_ENV !== "test") {
    throw new Error("Must be in test Environment");
}

vi.mock("../services/password.service.ts", () => ({
    PasswordService: {
        hashPassword: vi.fn().mockResolvedValue("safePassword"),
        comparePassword: vi.fn().mockResolvedValue(true),
    }
}));

const authService = new AuthService();

describe("AuthSService", () => {
    const testLoginDto = {
        email: "test@gmail.com",
        password: "testPassword",
    };

    const user1: getOneUserType = {
        id: 1,
        email: "test@gmail.com",
        username: "testUsername",
        passwordHash: "hashedPassword",
        canvasToken: "testToken",
    };
    const safeReturnUser: safeUserType = {
        id: 1,
        email: "test@gmail.com",
        username: "testUsername",
        canvasToken: "testToken",
    };

    const userToInsert = {
        email: "test2@gmail.com",
        username: "testUsername",
        password: "hashedPassword",
        canvasToken: "testToken",
    }

    const safeInsertedUser = {
        id: 2,
        username: 'testUsername',
        email: 'test2@gmail.com',
        canvasToken: 'testToken'
    }

    beforeAll(async () => {
        execSync(`bunx drizzle-kit push`);
        await insertOneUser(user1);
    });

    beforeEach(() => {
    vi.restoreAllMocks();
    });

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
    });

    it("should return the user without their password hash", async () => {
        const spyFindOneUserByEmail = vi.spyOn(UserRepo, "findOneUserByEmail");
        spyFindOneUserByEmail.mockResolvedValueOnce(user1);

        const response = await authService.loginUser(testLoginDto);

        expect(response).toMatchObject(safeReturnUser)
        expect(spyFindOneUserByEmail).toHaveBeenCalledTimes(1);
    });

    it("Should throw an HTTPException(401) for not finding user", async () => {
        const spyFindOneUserByEmail = vi.spyOn(UserRepo, "findOneUserByEmail");
        const spyCompare = vi.spyOn(PasswordService, "comparePassword");
        spyFindOneUserByEmail.mockResolvedValueOnce(undefined);
        
        try {
            await authService.loginUser(testLoginDto);
            expect(spyCompare).not.toBeCalled()
            expect.fail("Should throw an error")
        } catch(error: any) {
            expect(error).toBeInstanceOf(HTTPException);
            expect(error.status).toBe(401);
            const body = error.message
            expect(body).toMatch("Invalid email or password");
        }
        
    })

    it("Should throw an HTTPException(401) for wrong password", async () => {
        vi.mocked(PasswordService.comparePassword).mockResolvedValueOnce(false);
        const spyFindOneUserByEmail = vi.spyOn(UserRepo, "findOneUserByEmail");
        spyFindOneUserByEmail.mockResolvedValueOnce(user1);

        try {
            await authService.loginUser(testLoginDto);
            expect(spyFindOneUserByEmail).toBeCalledTimes(1);
            expect.fail("Should throw an error")
        } catch(error: any) {
            expect(error).toBeInstanceOf(HTTPException);
            expect(error.status).toBe(401);
            const body = error.message
            expect(body).toMatch("Invalid email or password");
        }
    });

    it("Should return inserted user without their passwordHash", async () => {
        const spyFindOneUserByEmail = vi.spyOn(UserRepo, "insertOneUser");

        const response = await authService.registerUser(userToInsert)
        expect(spyFindOneUserByEmail).toBeCalledTimes(1);
        expect(response).toMatchObject(safeInsertedUser);
    })
});
