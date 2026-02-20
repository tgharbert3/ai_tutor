import { redisConfig } from "@/config/redis.js";

import { createQueue } from "../factories/queue.js";

export const enrollmentQueue = createQueue("enrollmentQueue", redisConfig);