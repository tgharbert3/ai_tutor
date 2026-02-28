// This workers job is to orchestrate the fectching of enrollments from local and canvas,
// Compare them, decide on which courses have been dropped, and then pass the added/exisiting courses to the child

import type { Job, QueueOptions, Worker } from "bullmq";

import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";

import { FetchCanvasEnrollments } from "@/modules/enrollments/application/fetchCanvasEnrollments.js";

import type { EnrollmentJob } from "../domain/types.js";

import { createWorker } from "./worker.factory.js";

export function createEnrollmentWorker(redisConfig: QueueOptions, canvasFactory: CanvasApiPortFactory, apiToken: string, canvasBaseUrl: string): Worker {
    return createWorker(
        "enrollment",
        async (job: Job<EnrollmentJob>) => {
            const { ingestionId, userId, schoolId } = job.data;
            const cavasClient = canvasFactory.create({ apiToken, canvasBaseUrl });
            const fetchCanvasEnollments = new FetchCanvasEnrollments({ canvasClient, canvasBaseUrl });

            const canvasEnrollments = await fetchCanvasEnollments.execute();
        },
        redisConfig.connection,
        1,
    );
}