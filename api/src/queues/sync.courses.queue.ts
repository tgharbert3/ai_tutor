import "./workers/sync.courses.worker";
import { Queue } from "bullmq";

import env from "@/env.js";

export const syncCoursesQueue = new Queue("syncCourses", {
    connection: {
        host: "localhost",
        port: env.REDIS_PORT,
    },
});

export async function addCourseQueue(jobName: string, payload: object) {
    await syncCoursesQueue.obliterate();
    await syncCoursesQueue.add(jobName, payload);
    return "added job to queue";
};
