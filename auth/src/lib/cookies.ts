import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";

const REFRESH_TOKEN_NAME = "__Host-rt"
const ACCESS_TOKEN_NAME = "__Host-at"
const COOKIE_OPTS: CookieOptions = {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax"
    }

export const setAuthCookies = (c: Context, accessToken: string, refreshToken: string) => {
    // 15 Minutes
    setCookie(c, ACCESS_TOKEN_NAME, accessToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 900, 
    });
    // 7 Days (Match #generateRefreshExpiration)
    setCookie(c, REFRESH_TOKEN_NAME, refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, 
    });
};

export const clearAuthCookies = (c: Context) => {
    deleteAccessCookie(c),
    deleteRefreshCookie(c);
    return;
};

export const getAccessCookie = (c: Context) => {
    return getCookie(c, ACCESS_TOKEN_NAME);
}

export const getrefreshCookie = (c: Context) => {
    return getCookie(c, REFRESH_TOKEN_NAME);
}

const deleteRefreshCookie = (c: Context) => {
    deleteCookie(c, REFRESH_TOKEN_NAME, COOKIE_OPTS);
    return;
}

const deleteAccessCookie = (c: Context) => {
    deleteCookie(c, ACCESS_TOKEN_NAME, COOKIE_OPTS);
    return;
}