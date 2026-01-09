import type { Context } from "hono";

import env from "@/env.js";
import { addSyncCouresJob } from "@/queues/sync.courses.queue";

export async function handleSyncCourses(c: Context) {
    await addSyncCouresJob(env.API_TOKEN);
    return c.json({ message: "started syncing courses" }, 201);
}
