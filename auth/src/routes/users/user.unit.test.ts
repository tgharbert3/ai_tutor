import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { insertUserType } from "@/db/schema.js";

import env from "@/env.js";

import { findOneUserByEmail, findOneUserById, insertOneUser } from "./user.repo.js";

if (env.NODE_ENV !== "test") {
    throw new Error("Must be in test Environment");
}

// const client = testClient(createApp().route("/", router));

describe("user Routes", () => {
    beforeAll(() => {
        execSync(`bunx drizzle-kit push`);
    });

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
    });

    const user1: insertUserType = {
        email: "test@gmail.com",
        password: "testPassword",
        username: "testUsername",
        canvasToken: "testToken",
    };

    const user2: insertUserType = {
        email: "test2@gmail.com",
        password: "test2Password",
        username: "test2Username",
        canvasToken: "test2Token",
    };
    it("should return one use after being inserted", async () => {
        const response = await insertOneUser(user1);
        expect(response).toMatchObject(user1);
    });

    it("should return the user with the same id", async () => {
        const insertedUser = await insertOneUser(user2);
        if (!insertedUser) {
            throw new Error("User failed to insert in find one user by id test");
        }

        const response = await findOneUserById(insertedUser.id!);
        expect(response).toMatchObject(user2);
    });

    it("should return user1", async () => {
        const user = await findOneUserByEmail(user1.email);
        expect(user).toMatchObject(user1);
    });
});
