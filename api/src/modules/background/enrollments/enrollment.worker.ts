import type { ConnectionOptions, Job } from "bullmq";

import type { db } from "@/lib/types.js";

import { ServiceContainer } from "@/modules/services.container.js";

import type { fetchEnrollmentsJob } from "./enrollment.queue.js";

import { BaseWorkerAdapter } from "../adapters/worker.adapter.js";

export class EnrollmentWorker extends BaseWorkerAdapter<fetchEnrollmentsJob> {
    constructor(db: db, redisConfig: ConnectionOptions) {
        super("enrollmentQueue", async (job: Job<fetchEnrollmentsJob>) => {
            const { apiToken, canvasBaseUrl, userId } = job.data;

            const serviceContainer = new ServiceContainer(db, redisConfig, apiToken, canvasBaseUrl);

            const enrollmentService = serviceContainer.enrollmentService;

            const canvasEnrollments = await enrollmentService.fetchEnrollmentsFromCanvas();
            const localEnrollments = await enrollmentService.fetchLocalActiveEnrollmentIds(userId);

            // Use a set for more efficient look ups
            const canvasIdSet = new Set(canvasEnrollments.map(e => e.canvasCourseId));

            // Find the Ids that are in the local db but not in canvas
            // Will set the isActive to false
            const idsToDrop = localEnrollments.filter(id => !canvasIdSet.has(id));
            if (idsToDrop.length > 0) {
                await enrollmentService.setEnrollmentToFalse(userId, idsToDrop);
            };
        }, redisConfig);
    }

    async shutdown(): Promise<void> {
        await this.worker.close();
    }
}