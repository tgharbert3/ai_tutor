import { ServiceContainerMiddleware } from "@/app/http/middlewares/services.js";
import { CreateRouter } from "@/lib/create-app.js";

import * as handlers from "./courses.controller.js";

const router = CreateRouter();

router.post("/courses", ServiceContainerMiddleware, c => handlers.handleSyncCourses(c));

export default router;