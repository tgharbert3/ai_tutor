import { CreateRouter } from "@/lib/create-app.js";

import * as handlers from "./user.handlers.js";
import * as routes from "./user.routes.js";

const router = CreateRouter()
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.registerUser, handlers.create);

export default router;
