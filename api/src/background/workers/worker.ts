import type { ConnectionOptions, Processor } from "bullmq";

import { Worker } from "bullmq";

export function createWorker(name: string, processor: Processor, connection: ConnectionOptions, concurrency = 1) {
    const worker = new Worker(name, processor, {
        connection,
        concurrency,
    });

    return worker;
};
