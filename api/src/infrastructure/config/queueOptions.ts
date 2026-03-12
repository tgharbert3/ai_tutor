import type { QueueOptions } from "bullmq";

import env from "@/env.js";

export function getQueueOptions() {
    const queueOptions: QueueOptions = {
        connection: {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            maxRetriesPerRequest: null,
        },
        skipWaitingForReady: env.NODE_ENV === "test",
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
            removeOnComplete: {
                age: 60 * 60 * 24,
                count: 1000,
            },
            removeOnFail: {
                age: 60 * 60 * 60 * 7,
                count: 5000,
            },
        },
    };
    return queueOptions;
}