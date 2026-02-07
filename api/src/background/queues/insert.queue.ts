import { Queue } from "bullmq";

import { redisConfig } from "@/config/redis.js";

export const insertQueue = new Queue("insertQueue", {
    connection: redisConfig,
});