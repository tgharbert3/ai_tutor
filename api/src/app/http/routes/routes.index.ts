import { Hono } from "hono";

import { ingestionHandler } from "../controllers/sync.handlers.js";

// modules/routes/routes.index.ts
export default function syncRoutes() {
    const router = new Hono();

    router.post("/sync", ...ingestionHandler);

    return router;
}