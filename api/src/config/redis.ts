import env from "@/env.js";
import { QueueOptions } from "bullmq";

export const redisConfig: QueueOptions = {
    connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        maxRetriesPerRequest: null,
    }
}
