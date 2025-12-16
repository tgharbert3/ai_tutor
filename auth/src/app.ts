import configureOpenAPI from "@/lib/configure-openAPI.js";
import createApp from "@/lib/create-app.js";
import index from "@/routes/index.route.js";
import users from "@/routes/users/user.index.js";

const app = createApp();

const routes = [
  index,
  users,
];

configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
