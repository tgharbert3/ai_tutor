import { createQueue } from "@/background/factories/queue.js";
import { redisConfig } from "@/config/redis.js";

export const fetchAssignmentsQueue = createQueue("fetchAssigmentsQueue", redisConfig);
export const extractAssignmentsQueue = createQueue("extractAssignmentsQueue", redisConfig);
export const insertAssignmentsQueue = createQueue("insertAssignmentsQueue", redisConfig);