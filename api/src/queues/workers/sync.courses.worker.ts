import type { Job } from "bullmq";

import { Worker } from "bullmq";

import { redisConfig } from "@/config/redis";
import { CourseService } from "@/modules/courses/courses.service";

import * as CourseRepo from "../../modules/courses/courses.repo";

export const syncCoursesWorker = new Worker("syncCourses", async (job: Job) => {
    const { API_TOKEN } = job.data;
    const courseInstance = new CourseService(API_TOKEN);
    await courseInstance.syncCourses();
    await job.updateProgress(100);

    return "started worker";
}, {
    connection: redisConfig,
});

syncCoursesWorker.on("completed", async (_) => {
    const coursesFromDb = await CourseRepo.findAllCourses();
    console.log(coursesFromDb);
});
