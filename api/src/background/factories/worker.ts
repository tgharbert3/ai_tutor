import type { ConnectionOptions, Processor } from "bullmq";

import { Worker } from "bullmq";

export function createWorker(
    name: string,
    processor: Processor,
    connection: ConnectionOptions,
    concurrency = 1,
) {
    const worker = new Worker(name, processor, {
        connection,
        concurrency,
    });

    worker.on("completed", () => {
        console.info(`Completed job in queue ${name}`);
    });

    worker.on("failed", (_, err) => {
        console.error(`Failed job in queue ${name}, with error message: ${err.message}`);
    });

    return worker;
};