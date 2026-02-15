import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PinoLogger } from "hono-pino";

import * as z from "zod";

import type { ServiceContainer } from "@/modules/services.container.js";

import type * as schema from "../db/schema.js";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        services: ServiceContainer;
    };
};

export type AppEnv = "development" | "production" | "test";

export type db = PgliteDatabase<typeof schema> | NodePgDatabase<typeof schema>;

// interfaces

export type fetchAssignmentJob = {
    apiToken: string;
    canvasBaseUrl: string;
    courseId: number;
};

export type CanvasAssignmentType = {
    id: number;
    description: string | null;
    points_possible: number;
    due_at: string | null;
    course_id: number;
    name: string;
    html_url: string;
};

export type AssignmentType = {
    assignmentId: number;
    assignmentName: string;
    description: string;
    dueAt: string;
    courseId: number;
    pointsPossible: number;
    url: string;
};

// zod types

export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    course_code: z.string(),
});

export type CanvasCourse = z.infer<typeof CanvasCourseSchema>;