import type { QueueOptions } from "bullmq";

import env from "@/env.js";

export function getRedisConfig(): QueueOptions {
    const redisConfig: QueueOptions = {
        connection: {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            maxRetriesPerRequest: null,
        },
    };
    return redisConfig;
}