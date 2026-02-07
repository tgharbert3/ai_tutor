import { Queue } from "bullmq";

import { redisConfig } from "@/config/redis.js";

export const extractQueue = new Queue("extractQueue", {
    connection: redisConfig,
});