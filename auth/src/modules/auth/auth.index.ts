import { CreateRouter } from "@/lib/create-app.js";

import * as handlers from "./auth.handlers.js";

const app = CreateRouter().basePath("/api/v1");
// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
    .post("/login", ...handlers.loginHandlers)
    .post("/register", ...handlers.registerHandlers)
    .post("/refresh", ...handlers.refreshHandler)
    .post("/logout", ...handlers.logoutHandler);

export default app;
export type AppType = typeof routes;
