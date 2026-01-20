import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types.js";

import { loginDTO, registerDTO } from "@/lib/dto.js";
import { handleZodeValidationLoginError, handleZodValidationRegisterError } from "@/lib/errors.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";
import { setCookie } from "hono/cookie";

const factory = createFactory<AppBindings>();

export const loginHandlers = factory.createHandlers(
    zValidator("json", loginDTO, (result, c) => handleZodeValidationLoginError(result, c, HttpStatusCodes.BAD_REQUEST)),
    ServiceContainerMiddleware,
    async (c) => {
        const data = c.req.valid("json");
        const services = c.get("authService");
        const response = await services.loginUser(data);

        // TODO: refine the max age
        setCookie(c, "__Host-at", response.accessToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 900,
        });
        // TODO: Need to change path for refresh token
        setCookie(c, "__Host-rt", response.refreshToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 900,
        });
        return c.json({message: "Successfully logged in"}, HttpStatusCodes.OK);
    },
);
export const registerHandlers = factory.createHandlers(
    zValidator("json", registerDTO, (result, c) => handleZodValidationRegisterError(result, c, HttpStatusCodes.BAD_REQUEST)),
    ServiceContainerMiddleware,
    async (c) => {
        const data = c.req.valid("json");
        const services = c.get("authService");
        const response = await services.registerUser(data);
        setCookie(c, "__Host-at", response.accessToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 900,
        });
        // TODO: Need to change path for refresh token

        setCookie(c, "__Host-rt", response.refreshToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 900,
        });
        return c.json({message: "Successfully registered in"}, HttpStatusCodes.CREATED);
    },
);
