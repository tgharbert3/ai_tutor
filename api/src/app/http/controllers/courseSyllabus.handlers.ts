import { createFactory } from "hono/factory";

import type { AppBindings } from "@/lib/types.js";

import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const factory = createFactory<AppBindings>();

export const courseSyllabusHandler = factory.createHandlers(
    AuthMiddleware,
    async (c) => {
        try {
            const jweData = c.get("user");
            const id = c.req.param("id");
            const httpContainer = c.get("httpContainer");
            const courseTabs = httpContainer.getCourseSyllabusUC();
            const result = await courseTabs.execute(jweData.userId, Number(id));
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