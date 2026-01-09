import { CreateRouter } from "@/lib/create-app";

import * as handlers from "./courses.controller";

const router = CreateRouter();

router.post("/courses", c => handlers.handleSyncCourses(c));

export default router;
