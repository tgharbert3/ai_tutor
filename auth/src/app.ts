import createApp from "@/lib/create-app.js";
import users from "@/routes/users/user.index.js";

const app = createApp();

const routes = [
  users,
];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
