// This workers job is to orchestrate the fectching of enrollments from local and canvas,
// Compare them, decide on which courses have been dropped, and then pass the added/exisiting courses to the child

import type { Job, QueueOptions, Worker } from "bullmq";

import { createWorker } from "./worker.factory.js";

export function createEnrollmentWorker(redisConfig: QueueOptions): Worker {
    return createWorker(
        "enrollment",
        async (job: Job) => {

        },
        redisConfig.connection,
        1,
    );
}