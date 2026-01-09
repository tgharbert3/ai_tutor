import { CreateRouter } from "@/lib/create-app";
import { ServiceContainerMiddleware } from "@/middlewares/services";

import * as handlers from "./courses.controller";

const router = CreateRouter();

router.post("/courses", ServiceContainerMiddleware, c => handlers.handleSyncCourses(c));

export default router;
