import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import env from "@/env.js";
import { ZOD_ERROR_MESSAGES } from "@/lib/constants.js";
import createApp from "@/lib/create-app.js";

import router from "../users/user.index.js";

if (env.ENVIRONMENT !== "test") {
  throw new Error("Must be in test Environment");
}

const client = testClient(createApp().route("/", router));

describe("user Routes", () => {
  beforeAll(() => {
    execSync(`bunx drizzle-kit push`);
  });

  afterAll(async () => {
    if (fs.existsSync("test.db")) {
      fs.rmSync("test.db", { force: true });
    }
  });

  it("get /users validates the body when creating a new user", async () => {
    const response = await client.users[":id"].$get({
      param: {
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error).toMatchObject({
        issues: [
          {
            path: ["id"],
            message: ZOD_ERROR_MESSAGES.EXPECTED_NUMBER,
          },
        ],
      });
    }
  });
});

// describe("user handlers", () => {

// });
