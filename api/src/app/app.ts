import sync from "@/app/http/routes/routes.index.js";
import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { getDb } from "@/infrastructure/db/index.js";
import { ClientFactory } from "@/infrastructure/internal/fetch.client.js";
import { redisPubSubService } from "@/infrastructure/redis.pubSub/redis.pubSub.js";
import { SanitizeHtml } from "@/infrastructure/sanitizeHtml/sanitizeHtml.js";
import createApp from "@/lib/create-app.js";

import type { StartIngestionWorkers } from "./composition/containers/startIngestonWorkers.js";

import { getQueueOptions } from "../infrastructure/config/queueOptions.js";
import { buildHttpContainer } from "./composition/containers/buildHttpContainer.js";
import { buildWorkerContainer } from "./composition/containers/buildWorkerContainer.js";
import { startIngestionWorkers, stopWorkers } from "./composition/containers/startIngestonWorkers.js";

let ingestionWorkers: StartIngestionWorkers;

function bootstrap() {
    const workerContainer = buildWorkerContainer(getDb(), getQueueOptions(), {
        clientFactory: new ClientFactory(),
        canvasFactory: new CanvasClientFactory(),
        sanitizeHtml: new SanitizeHtml(),
        // Singleton service
        pubSubService: redisPubSubService,
    });

    ingestionWorkers = startIngestionWorkers(workerContainer);
    const httpContiner = buildHttpContainer(getDb(), getQueueOptions(), {
        clientFactory: new ClientFactory(),
        canvasFactory: new CanvasClientFactory(),
        sanitizeHtml: new SanitizeHtml(),
        pubSubService: redisPubSubService,
    });

    const app = createApp(httpContiner);

    app.use("*", async (c, next) => {
        c.set("httpContainer", httpContiner);
        await next();
    });

    const routes = [
        sync(),
    ];

    routes.forEach((route) => {
        app.route("/", route);
    });
    return app;
}

async function shutdown(signal: string) {
    console.warn(`received ${signal}, shutting down`);
    if (ingestionWorkers) {
        await stopWorkers(ingestionWorkers);
    }
    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default bootstrap;