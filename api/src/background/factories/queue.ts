import type { QueueOptions } from "bullmq";

import { Queue } from "bullmq";

export function createQueue(queueName: string, options?: QueueOptions | undefined) {
    const queue = new Queue(queueName, options);
    return queue;
};