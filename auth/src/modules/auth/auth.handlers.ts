import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types.js";

import { loginDTO, registerDTO } from "@/lib/dto.js";
import { handleZodeValidationLoginError, handleZodValidationRegisterError } from "@/lib/errors.js";
import { ServiceContainerMiddleware } from "@/middlewares/services.js";
import { clearAuthCookies, getrefreshCookie, setAuthCookies } from "@/lib/cookies.js";
import { BusyError, TokenReuseError, TokenValidationError, UserNotFoundError } from "@/lib/error.class.js";

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
        const validUrl = await services.urlCheck(data.canvasToken, data.fullUrl);
        if (validUrl) {
            setAuthCookies(c, response.accessToken, response.refreshToken);
            return c.json({message: "Successfully registered"}, HttpStatusCodes.CREATED);
        }
        return c.json({error: "Invalid url"}, HttpStatusCodes.UNAUTHORIZED);
        
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

            // TODO: extract this
            if (error instanceof TokenReuseError) {
                clearAuthCookies(c)
                return c.json({error: "Unauthorized Access"}, HttpStatusCodes.FORBIDDEN);
            }
            if (error instanceof BusyError) {
                return c.json({error: "Unable to refresh token"}, HttpStatusCodes.TOO_MANY_REQUESTS);
            }
            if (error instanceof TokenValidationError) {
                return c.json({error: "Unable to decrypt token"}, HttpStatusCodes.UNAUTHORIZED)
            }
            if (error instanceof UserNotFoundError) {
                return c.json({error: "User not found"}, HttpStatusCodes.UNAUTHORIZED);
            }
            throw error;
        }
    }
)

export const logoutHandler = factory.createHandlers (
    ServiceContainerMiddleware,
    async (c) => {
         const refreshToken = getrefreshCookie(c);
        if (!refreshToken) {
            return c.json({message: "No user token"},  HttpStatusCodes.UNAUTHORIZED)
        }

        const services = c.get("authService");
        try {
            await services.handleLogout(refreshToken);
        } catch (error: any) {
            console.warn(`Logout Failed, ${error}`)
        }
        
        clearAuthCookies(c)
        return c.newResponse(null, HttpStatusCodes.NO_CONTENT);
    }
)
