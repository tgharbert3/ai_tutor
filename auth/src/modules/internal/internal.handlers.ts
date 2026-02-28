import { AppBindings } from "@/lib/types.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";
import { createFactory } from "hono/factory";

const factory = createFactory<AppBindings>();

export const internalHandlers = factory.createHandlers(
    ServiceContainerMiddleware,
    async (c) => {
        const services = c.get("authService");
        const id = c.req.param('userId')
        const token = await services.getCanvasToken(id!)
        return c.json({canvasToken: token.canvasToken}, 200);
    },
);