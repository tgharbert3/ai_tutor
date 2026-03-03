import sync from "@/app/http/routes/routes.index.js";
import { getDb } from "@/infrastructure/db/index.js";
import createApp from "@/lib/create-app.js";

import { getRedisConfig } from "../infrastructure/config/redis.js";
import { AppContainer } from "./composition/app.composititon.js";

function bootstrap() {
    const db = getDb();
    const redis = getRedisConfig();
    const appContainer = new AppContainer(db, redis);
    appContainer.startWorkers();
    const app = createApp(appContainer);
    const routes = [
        sync(),
    ];

    routes.forEach((route) => {
        app.route("/", route);
    });
    app.use("*", async (c, next) => {
        c.set("appContainer", appContainer);
        await next();
    });
    return app;
}

export default bootstrap;