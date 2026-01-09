import { Queue } from "bullmq";

import { redisConfig } from "@/config/redis";

export const syncCoursesQueue = new Queue("syncCourses", {
    connection: redisConfig,
});

export async function addSyncCouresJob(API_TOKEN: string, canvasBaseUrl: string) {
    return await syncCoursesQueue.add("sync-all", {
        API_TOKEN,
        canvasBaseUrl,
    });
};
