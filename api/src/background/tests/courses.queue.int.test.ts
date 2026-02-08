import { QueueEvents } from "bullmq";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import env from "@/env.js";

import * as CourseRepo from "../../modules/courses/courses.repo.js";
import { addSyncCouresJob, syncCoursesQueue } from "../sync.courses.queue.js";
import { syncCoursesWorker } from "../sync.courses.worker.js";
import { fetchAssignmentsWorker } from "../assignments/assignments.workers.js";
import { fetchAssignmentsQueue } from "../assignments/assignment.queue.js";
import { loadAssignments } from "../assignments/assignments.fp.js";

if (env.NODE_ENV !== "test") {
    throw new Error("Must be in test Environment");
}

describe("user Routes", () => {
    beforeAll(async () => {
        execSync(`bunx drizzle-kit push`);
        await syncCoursesWorker.waitUntilReady();
        await fetchAssignmentsWorker.waitUntilReady();
    });

    afterAll(async () => {
        if (fs.existsSync("test.db")) {
            fs.rmSync("test.db", { force: true });
        }
        await syncCoursesWorker.close();
        await syncCoursesQueue.close();
        await fetchAssignmentsQueue.close();
        await fetchAssignmentsWorker.close();
    });

    it("should start the sync courses queue", async () => {
        const job = await addSyncCouresJob(env.API_TOKEN, env.CANVAS_BASE_URL);
        const result = await job.waitUntilFinished(new QueueEvents("syncCourses"));
        const assignmentsJob = await loadAssignments(env.API_TOKEN, env.CANVAS_BASE_URL, 81419)
        const result2 = await assignmentsJob.job.waitUntilFinished(new QueueEvents("insertAssignmentsQueue"))
        console.log(result2);
        expect(result).toMatchObject({ status: "successfully synced courses" });

        const allCoruses = await CourseRepo.findAllCourses();
        expect(allCoruses).toBeInstanceOf(Array);
    });
});
