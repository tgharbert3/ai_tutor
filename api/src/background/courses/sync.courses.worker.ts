import type { Job } from "bullmq";

import { Worker } from "bullmq";

import { redisConfig } from "@/config/redis.js";
import db from "@/db/index.js";
import { CourseRepository } from "@/modules/courses/courses.repo.js";
import { CourseService } from "@/modules/courses/courses.service.js";

const courseRepo = new CourseRepository(db);

export const syncCoursesWorker = new Worker("syncCourses", async (job: Job) => {
    const { API_TOKEN, canvasBaseUrl } = job.data;
    const courseInstance = new CourseService(courseRepo, API_TOKEN, canvasBaseUrl);
    await courseInstance.syncCourses();
    await job.updateProgress(100);

    return { status: "successfully synced courses" };
}, {
    connection: redisConfig,
});

// syncCoursesWorker.on("completed", async (_) => {
//     const coursesFromDb = await CourseRepo.findAllCourses();
//     console.log(coursesFromDb);
// });