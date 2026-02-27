import type { QueueOptions, Worker } from "bullmq";

import { createEnrollmentWorker } from "./enrollment.worker.js";

export function startWorkers(redis: QueueOptions): Worker[] {
    const workers = [
        createEnrollmentWorker(redis),
    ];

    return workers;
}