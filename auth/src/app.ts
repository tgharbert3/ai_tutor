import createApp from "@/lib/create-app.js";
import users from "@/modules/auth/auth.index.js";
import internal from "@/modules/internal/internal.routes.index.js";

const app = createApp();

const routes = [
    users,
    internal,
];

routes.forEach((route) => {
    app.route("/", route);
});

export default app;
