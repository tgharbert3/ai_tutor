import type { Job } from "bullmq";

import { Worker } from "bullmq";

import env from "@/env.js";

import * as CourseRepo from "../../modules/courses/courses.repo";

export const syncCoursesWorker = new Worker("syncCourses", async (job: Job) => {
    await job.updateProgress(100);

    return "started worker";
}, {
    connection: {
        host: "localhost",
        port: env.REDIS_PORT,
    },
});

syncCoursesWorker.on("completed", async (_) => {
    const coursesFromDb = await CourseRepo.findAllCourses();
    console.log(coursesFromDb);
});
