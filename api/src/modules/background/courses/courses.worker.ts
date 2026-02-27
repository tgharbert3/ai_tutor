import type { ConnectionOptions, Job } from "bullmq";

import type { db } from "@/lib/types.js";

import type { CoursesJob } from "./courses.queue.js";

import { BaseWorkerAdapter } from "../adapters/worker.adapter.js";

export class CoursestWorker extends BaseWorkerAdapter<CoursesJob> {
    constructor(db: db, redisConfig: ConnectionOptions) {
        super("coursesQueue", async (job: Job<CoursesJob>) => {
            const courseIdArray = job.data;
        }, redisConfig);
    }

    async shutdown(): Promise<void> {
        await this.worker.close();
    }
}