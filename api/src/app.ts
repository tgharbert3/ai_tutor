import createApp from "@/lib/create-app.js";
import courses from "@/modules/courses/courses.index.js";
import sync from "@/modules/routes/routes.index.js";

const app = createApp();

const routes = [
    courses,
    sync,
];

routes.forEach((route) => {
    app.route("/", route);
});

export default app;