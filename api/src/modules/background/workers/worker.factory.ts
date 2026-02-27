import type { ConnectionOptions, Processor } from "bullmq";

import { Worker } from "bullmq";

export function createWorker(queueName: string, processor: Processor, connection: ConnectionOptions, concurrency = 1) {
    return new Worker(queueName, processor, {
        connection,
        concurrency,
    });
};