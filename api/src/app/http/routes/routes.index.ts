import { Hono } from "hono";

import * as ingestionRunHandlers from "../controllers/sync.handlers.js";

// modules/routes/routes.index.ts
export default function syncRoutes() {
    const router = new Hono();

    router.post("/sync", ...ingestionRunHandlers.ingestionHandler);
    router.get("/ingestionRunStatus/:ingestionRunId/events", ...ingestionRunHandlers.ingestionStatus);

    return router;
}