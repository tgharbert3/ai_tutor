import { createFactory } from "hono/factory";

import type { AppBindings } from "@/lib/types.js";

import { AuthMiddleware } from "@/app/http/middlewares/auth.middleware.js";

const factory = createFactory<AppBindings>();

export const ingestionHandler = factory.createHandlers(
    AuthMiddleware,
    async (c) => {
        try {
            const jweData = c.get("user");
            const appContainer = c.get("appContainer");
            const scope = appContainer.createPreIngestionScope(jweData);
            const result = await scope.execute();
            // TODO: update to websocket
            return c.json(result, 202);
        }
        catch (error: any) {
            console.error(error.message);
            return c.json({ error: "Unable to start ingestion" }, 401);
        }
    },
);