import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { insertUserType, safeUserType } from "@/db/schema.js";

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
        passwordHash: "testPassword",
        username: "testUsername",
        canvasToken: "testToken",
    };

    const user2: insertUserType = {
        email: "test2@gmail.com",
        passwordHash: "test2Password",
        username: "test2Username",
        canvasToken: "test2Token",
    };

    

    it("should return one use after being inserted", async () => {
        const response = await insertOneUser(user1);
        expect(response).toMatchObject(
            {
                email: "test@gmail.com",
                username: "testUsername",
                canvasToken: "testToken",
            },
        );
    });

    it("should return the user with the same id", async () => {
        const insertedUser = await insertOneUser(user2);
        const safeUser2: safeUserType = {
            id: insertedUser!.id,
            email: "test2@gmail.com",
            username: "test2Username",
            canvasToken: "test2Token",
        };
        if (!insertedUser) {
            throw new Error("User failed to insert in find one user by id test");
        }

        const response = await findOneUserById(insertedUser.id!);
        expect(response).toMatchObject(safeUser2);
    });

    it("should return user1", async () => {
        const user = await findOneUserByEmail(user1.email);
        expect(user).toMatchObject(user1);
    });
});
