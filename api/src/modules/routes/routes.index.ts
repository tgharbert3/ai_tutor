import { CreateRouter } from "@/lib/create-app.js";

import * as syncHandlers from "../controllers/sync.handlers.js";

const app = CreateRouter().basePath("/api/v1");
// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
    .post("/sync", ...syncHandlers.syncHandler);

export default app;
export type AppType = typeof routes;