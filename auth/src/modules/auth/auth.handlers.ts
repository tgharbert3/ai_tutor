import { createFactory } from "hono/factory";

import type { loginDtoType, registerDtoType } from "@/lib/dto.js";
import type { AppBindings } from "@/lib/types.js";

import { ServiceContainerMiddleware } from "@/middlewares/services.js";

const factory = createFactory<AppBindings>();

export const loginHandlers = factory.createHandlers(
    ServiceContainerMiddleware,
    async (c) => {
        const { email, password } = await c.req.json();
        const data: loginDtoType = {
            email,
            password,
        };
        const services = c.get("authService");
        const response = await services.loginUser(data);
        return c.json(response, 200);
    },
);
export const registerHandlers = factory.createHandlers(
    ServiceContainerMiddleware,
    async (c) => {
        const { email, password, username, canvasToken } = await c.req.json();
        const data: registerDtoType = {
            email,
            password,
            username,
            canvasToken,
        };
        const services = c.get("authService");
        const response = await services.registerUser(data);
        return c.json(response, 200);
    },
);
