import { createFactory } from "hono/factory";
import { streamSSE } from "hono/streaming";

import type { AppBindings } from "@/lib/types.js";
import type { Counts } from "@/modules/ingestion/ingestionTasks/domain/types.js";

import { AuthMiddleware } from "@/app/http/middlewares/auth.middleware.js";

const factory = createFactory<AppBindings>();

export const ingestionHandler = factory.createHandlers(
    AuthMiddleware,
    async (c) => {
        try {
            const jweData = c.get("user");
            const httpContainer = c.get("httpContainer");
            const scope = httpContainer.createPreIngestionScope(jweData);
            const result = await scope.execute();
            return c.json(result, 202);
        }
        catch (error: any) {
            console.error(error.message);
            return c.json({ error: "Unable to start ingestion" }, 401);
        }
    },
);

export const ingestionStatus = factory.createHandlers(
    AuthMiddleware,
    async (c) => {
        return streamSSE(c, async (stream) => {
            const httpContainer = c.get("httpContainer");
            const ingestionRunId = c.req.param("ingestionRunId");

            const subService = httpContainer.getPubSubService();
            await subService.subscribe(`ingestion-run-status:${ingestionRunId}`, async (message) => {
                await stream.writeSSE({
                    data: message,
                    event: "ingestion-update",
                    id: ingestionRunId,
                });

                const counts: Counts = JSON.parse(message);
                if (counts.runningCount === "0" && counts.queuedCount === "0") {
                    subService.unsubscribe(`ingestion-run-status:${ingestionRunId}`);
                    await stream.close();
                }
            });
            try {
                await new Promise<void>((resolve) => {
                    c.req.raw.signal.addEventListener("abort", () => resolve(), { once: true });
                });
            }
            finally {
                subService.unsubscribe(`ingestion-run-status:${ingestionRunId}`);
            }
        });
    },
);