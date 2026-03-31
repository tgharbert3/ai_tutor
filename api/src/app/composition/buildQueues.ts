import type { QueueOptions } from "bullmq";

import { createQueue } from "@/modules/ingestion/background/factories/queue.factory.js";

import type { AppQueues } from "./types.js";

export function buildQueues(queueOptions: QueueOptions) {
    return {
        enrollments: createQueue("enrollments", queueOptions),
        courses: createQueue("courses", queueOptions),
        canvasFetch: createQueue("canvasFetch", queueOptions),
        courseFullIngest: createQueue("courseFullIngest", queueOptions),
        courseChange: createQueue("courseChange", queueOptions),
        process: createQueue("process", queueOptions),
        dbWrite: createQueue("dbWrite", queueOptions),
        checkRunCompletion: createQueue("checkRunCompletion", queueOptions),
        vectorization: createQueue("vectorization", queueOptions),
    } satisfies AppQueues;
}