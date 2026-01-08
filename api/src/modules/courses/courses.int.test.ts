import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import env from "@/env.js";

import * as CourseRepo from "./courses.repo.js";
import { CourseService } from "./courses.service";

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

  it("should return an array of courses", async () => {
    const courseInstance = new CourseService(env.API_TOKEN);
    const response = await courseInstance.syncCourses();
    expect(response).toBeInstanceOf(Array);

    const coursesFromDb = await CourseRepo.findAllCourses();
    console.log(coursesFromDb);
  });
});
