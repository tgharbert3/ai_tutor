import { CreateRouter } from "@/lib/create-app.js";

import * as handlers from "./auth.handlers.js";

const app = CreateRouter().basePath("/api/v1");
// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
    .post("/login", ...handlers.loginHandlers)
    .get("/login/health", c => c.json({ message: "hello from login" }, 200))
    .post("/register", ...handlers.registerHandlers);

export default app;
export type AppType = typeof routes;
