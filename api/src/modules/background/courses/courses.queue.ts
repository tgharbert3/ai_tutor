import type { QueueOptions } from "bullmq";

import { BaseQueue } from "../adapters/queue.adapter.js";

export interface CoursesJob {
    courseId: number;
}
export class CoursesQueue extends BaseQueue<CoursesJob> {
    constructor(redisConfig: QueueOptions) {
        super("coursesQueue", redisConfig);
    };
}