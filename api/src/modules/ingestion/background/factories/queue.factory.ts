import type { QueueOptions } from "bullmq";

import { Queue } from "bullmq";

export function createQueue(queueName: string, opts?: QueueOptions): Queue {
    return new Queue(queueName, opts);
}