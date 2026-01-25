import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types.js";

import { loginDTO, registerDTO } from "@/lib/dto.js";
import { handleZodeValidationLoginError, handleZodValidationRegisterError } from "@/lib/errors.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";
import { clearAuthCookies, getrefreshCookie, setAuthCookies } from "@/lib/cookies.js";
import { BusyError, TokenReuseError } from "@/lib/error.class.js";

const factory = createFactory<AppBindings>();

export const loginHandlers = factory.createHandlers(
    zValidator("json", loginDTO, (result, c) => handleZodeValidationLoginError(result, c, HttpStatusCodes.BAD_REQUEST)),
    ServiceContainerMiddleware,
    async (c) => {
        const data = c.req.valid("json");
        const services = c.get("authService");
        const response = await services.loginUser(data);
        setAuthCookies(c, response.accessToken, response.refreshToken);
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
        setAuthCookies(c, response.accessToken, response.refreshToken);
        return c.json({message: "Successfully registered"}, HttpStatusCodes.CREATED);
    },
);

export const refreshHandler = factory.createHandlers (
    ServiceContainerMiddleware,
    async (c) => {
        const refreshToken = getrefreshCookie(c);
        if (!refreshToken) {
            return c.json({message: "No user token"},  HttpStatusCodes.UNAUTHORIZED)
        }
        const services = c.get("authService");
        try {
            const {at, rt} =  await services.handleRefresh(refreshToken);
            setAuthCookies(c, at, rt);
            return c.json({message: "Successfully refreshed cookies"}, HttpStatusCodes.OK)
        } catch (error: any) {
            if (error instanceof TokenReuseError) {
                clearAuthCookies(c)
                return c.json({error: "Unauthorized Access"}, HttpStatusCodes.FORBIDDEN);
            }
            if (error instanceof BusyError) {
                return c.json({error: "Unable to refresh token"}, HttpStatusCodes.TOO_MANY_REQUESTS);
            }
            throw error;
        }
        
    }
)
