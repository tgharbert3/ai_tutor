import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";

const isProd = process.env.NODE_ENV === "production";

const REFRESH_TOKEN_NAME = isProd ? "__Host-rt" : "rt";
const ACCESS_TOKEN_NAME = isProd ? "__Host-at" : "at";

const BASE_COOKIE_OPTS: CookieOptions = {
  path: "/",
  secure: isProd,
  httpOnly: true,
  sameSite: "lax",
};

export const setAuthCookies = (
  c: Context,
  accessToken: string,
  refreshToken: string,
) => {
  setCookie(c, ACCESS_TOKEN_NAME, accessToken, {
    ...BASE_COOKIE_OPTS,
    maxAge: 900, // 15 minutes
  });

  setCookie(c, REFRESH_TOKEN_NAME, refreshToken, {
    ...BASE_COOKIE_OPTS,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
};

export const clearAuthCookies = (c: Context) => {
  deleteAccessCookie(c);
  deleteRefreshCookie(c);
};

export const getAccessCookie = (c: Context) => {
  return getCookie(c, ACCESS_TOKEN_NAME);
};

export const getRefreshCookie = (c: Context) => {
  return getCookie(c, REFRESH_TOKEN_NAME);
};

const deleteRefreshCookie = (c: Context) => {
  deleteCookie(c, REFRESH_TOKEN_NAME, BASE_COOKIE_OPTS);
};

const deleteAccessCookie = (c: Context) => {
  deleteCookie(c, ACCESS_TOKEN_NAME, BASE_COOKIE_OPTS);
};