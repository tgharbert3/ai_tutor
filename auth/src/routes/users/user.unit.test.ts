import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe } from "vitest";

import env from "@/env.js";

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
});

// describe("user handlers", () => {

// });
