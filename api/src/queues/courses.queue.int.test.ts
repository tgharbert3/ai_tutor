import { QueueEvents } from "bullmq";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import env from "@/env.js";

import { addSyncCouresJob, syncCoursesQueue } from "./sync.courses.queue";
import { syncCoursesWorker } from "./workers/sync.courses.worker";

if (env.NODE_ENV !== "test") {
    throw new Error("Must be in test Environment");
}

describe("user Routes", () => {
    beforeAll(async () => {
        execSync(`bunx drizzle-kit push`);
        await syncCoursesWorker.waitUntilReady();
    });

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
        await syncCoursesWorker.close();
        await syncCoursesQueue.close();
    });

    it("should start the sync courses queue", async () => {
        const job = await addSyncCouresJob(env.API_TOKEN);
        const result = await job.waitUntilFinished(new QueueEvents("syncCourses"));
        expect(result).toMatch("started worker");
    });
});
