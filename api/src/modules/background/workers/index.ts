import type { QueueOptions, Worker } from "bullmq";

import type { AppRepos } from "@/app/composition/types.js";
import type { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";

import { createEnrollmentWorker } from "./enrollment.worker.js";

export function startWorkers(
    redis: QueueOptions,
    canvasClient: CanvasClientFactory,
    clientFactory: ClientApiPortFactory,
    repos: AppRepos,
): Worker[] {
    const workers = [
        createEnrollmentWorker(redis, canvasClient, clientFactory, repos.ingestionRuns),
    ];

    return workers;
}