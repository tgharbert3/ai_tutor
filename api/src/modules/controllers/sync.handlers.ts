import { createFactory } from "hono/factory";

import type { AppBindings } from "@/lib/types.js";

import { AuthMiddleware } from "@/middlewares/auth.middleware.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";

const factory = createFactory<AppBindings>();

export const syncHandler = factory.createHandlers(
    AuthMiddleware,
    ServiceContainerMiddleware,
    async (c) => {
        const services = c.get("services");
        const userService = services.userService;
        const user = userService.syncUserFacade(c.get("user"));
        if (!user) {
            return c.json({ error: "Unable to find user" }, 403);
        };
        // Call the flow producer to start the sync

        // TODO: update to websocket
        return c.json({ messge: "Started injestion", metadata: user }, 202);
    },
);