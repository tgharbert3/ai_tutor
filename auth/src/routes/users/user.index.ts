import { CreateRouter } from "@/lib/create-app.js";

import * as handlers from "./user.handlers.js";
import * as routes from "./user.routes.js";

const router = CreateRouter()
  .openapi(routes.getOne, handlers.getOne);

export default router;
