import { Hono } from "hono";

import * as dashboardHandlers from "../controllers/dashboard.handlers.js";
import * as ingestionRunHandlers from "../controllers/ingestion.handlers.js";

// modules/routes/routes.index.ts
export default function syncRoutes() {
    const router = new Hono();

    router.post("/sync", ...ingestionRunHandlers.ingestionHandler);
    router.get("/ingestionRunStatus/:ingestionRunId/events", ...ingestionRunHandlers.ingestionStatus);
    router.get("/dashboard", ...dashboardHandlers.dashboardHandler);

    return router;
}