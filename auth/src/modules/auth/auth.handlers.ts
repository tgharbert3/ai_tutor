import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import type { AppBindings } from "@/lib/types.js";

import { loginDTO, registerDTO } from "@/lib/dto.js";
import { handleZodeValidationLoginError, handleZodValidationRegisterError } from "@/lib/errors.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";

const factory = createFactory<AppBindings>();

export const loginHandlers = factory.createHandlers(
    zValidator("json", loginDTO, (result, c) => handleZodeValidationLoginError(result, c, 401)),
    ServiceContainerMiddleware,
    async (c) => {
        const data = c.req.valid("json");
        const services = c.get("authService");
        const response = await services.loginUser(data);
        return c.json(response, 200);
    },
);
export const registerHandlers = factory.createHandlers(
    zValidator("json", registerDTO, (result, c) => handleZodValidationRegisterError(result, c, 401)),
    ServiceContainerMiddleware,
    async (c) => {
        const data = c.req.valid("json");
        const services = c.get("authService");
        const response = await services.registerUser(data);
        return c.json(response, 201);
    },
);
