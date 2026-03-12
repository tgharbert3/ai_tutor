import sync from "@/app/http/routes/routes.index.js";
import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { getDb } from "@/infrastructure/db/index.js";
import { ClientFactory } from "@/infrastructure/internal/fetch.client.js";
import { SanitizeHtml } from "@/infrastructure/sanitizeHtml/sanitizeHtml.js";
import createApp from "@/lib/create-app.js";

import { getQueueOptions } from "../infrastructure/config/queueOptions.js";
import { AppContainer } from "./composition/app.composititon.js";

let appContainer: AppContainer;

function instantiateAppContiner() {
    return new AppContainer(getDb(), getQueueOptions(), {
        clientFactory: new ClientFactory(),
        canvasFactory: new CanvasClientFactory(),
        sanitizeHtml: new SanitizeHtml(),
    });
}

function bootstrap() {
    appContainer = instantiateAppContiner();
    appContainer.startWorkers();
    const app = createApp(appContainer);

    app.use("*", async (c, next) => {
        c.set("appContainer", appContainer);
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
    if (appContainer) {
        await appContainer.shutdownWorkers();
    }
    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default bootstrap;