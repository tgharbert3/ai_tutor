import { Queue } from "bullmq";

import { redisConfig } from "@/config/redis.js";

export const fetchFromCanvasQueue = new Queue("fetchFromCavas", {
    connection: redisConfig,
});
