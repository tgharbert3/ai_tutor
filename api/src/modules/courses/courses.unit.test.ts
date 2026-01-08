import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { insertOneCourseType } from "@/db/schema.js";

import env from "@/env.js";

import { insertOneCourse } from "./courses.repo.js";

if (env.NODE_ENV !== "test") {
  throw new Error("Must be in test Environment");
}

describe("user Routes", () => {
  beforeAll(() => {
    execSync(`bunx drizzle-kit push`);
  });

  afterAll(async () => {
    if (fs.existsSync("test.db")) {
      fs.rmSync("test.db", { force: true });
    }
  });

  it("should return th course that was inserted", async () => {
    const course: insertOneCourseType = {
      courseId: 123,
      courseName: "Test Course",
      courseCode: "T1",
    };
    const response = await insertOneCourse(course);
    expect(response).toMatchObject(course);
  });
});
