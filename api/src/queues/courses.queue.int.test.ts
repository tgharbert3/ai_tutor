import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, it } from "vitest";

import env from "@/env.js";
import { CourseService } from "@/modules/courses/courses.service";

import { addCourseQueue } from "./sync.courses.queue";

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

    it("should start the sync courses queue", async () => {
        const courseInstance = new CourseService(env.API_TOKEN);
        const response1 = await addCourseQueue("Test job", { syncCourses: await courseInstance.syncCourses() });
        console.log(`RESPONSE1: ${response1}`);
    });
});
