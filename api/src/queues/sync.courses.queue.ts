import { Queue } from "bullmq";

import env from "@/env.js";

export const syncCoursesQueue = new Queue("syncCourses", {
    connection: {
        host: "127.0.0.1",
        port: env.REDIS_PORT,
        maxRetriesPerRequest: null,
    },
});

export async function addSyncCouresJob(API_TOKEN: string) {
    return await syncCoursesQueue.add("sync-all", {
        API_TOKEN,
    });
};
