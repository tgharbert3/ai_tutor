import createApp from "@/lib/create-app.js";
import courses from "@/modules/courses/courses.index";

const app = createApp();

const routes = [
  courses,
];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
