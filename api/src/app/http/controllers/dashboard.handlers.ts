import { createFactory } from "hono/factory";

import type { AppBindings } from "@/lib/types.js";

import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const factory = createFactory<AppBindings>();

export const dashboardHandler = factory.createHandlers(
    AuthMiddleware,
    async (c) => {
        try {
            const jweData = c.get("user");
            const httpContainer = c.get("httpContainer");
            const courseInfoForDashboard = httpContainer.getCourseInfoForDashboardUC();
            const result = await courseInfoForDashboard.execute(jweData.userId);
            return c.json(result, 200);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return c.json({ error: "Internal Server Error" }, 500);
            }
        }
    },
);