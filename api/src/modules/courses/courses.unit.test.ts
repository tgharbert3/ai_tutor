import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import env from "@/env.js";

import { fetchCoursesFromCanvas } from "./courses.client.js";

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

  // it("should return th course that was inserted", async () => {
  //   const course: insertOneCourseType = {
  //     courseId: 123,
  //     courseName: "Test Course",
  //     courseCode: "T1",
  //   };
  //   const response = await insertOneCourse(course);
  //   expect(response).toMatchObject(course);
  // });

  it("should return courses from canvas", async () => {
    const response = await fetchCoursesFromCanvas();
    expect(response).toBeInstanceOf(Array);
  });
});
