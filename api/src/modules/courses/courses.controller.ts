import type { Context } from "hono";

export async function handleSyncCourses(c: Context) {
    const services = c.get("services");
    const job = services.courses.triggerSyncCourses();
    return c.json({ message: "started syncing courses", jobId: job.id }, 201);
}
