import { CreateRouter } from "@/lib/create-app.js";
import { InternalAuthMiddleware } from "@/middlewares/internalAuth.middlware.js";
import * as handlers from "./internal.handlers.js";

const app = CreateRouter().basePath("/internal");

 app.use("*", InternalAuthMiddleware);
// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
    .get("/canvas-credentials/:userId", ...handlers.internalHandlers)

export default app;
export type AppType = typeof routes;
