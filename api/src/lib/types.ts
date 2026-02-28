import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PinoLogger } from "hono-pino";
import type { JWTPayload } from "jose";

import * as z from "zod";

import type { AppContainer } from "@/app/composition/app.composititon.js";
import type { ServiceContainer } from "@/modules/services.container.js";

import type * as schema from "../infrastructure/db/schema.js";

export interface AppBindings {
    Variables: {
        logger: PinoLogger;
        appContainer: AppContainer;
        services: ServiceContainer;
        user: JWTData;
    };
}

export type AppEnv = "development" | "production" | "test";

export type db = PgliteDatabase<typeof schema> | NodePgDatabase<typeof schema>;

export interface CanvasAssignmentType {
    id: number;
    description: string | null;
    points_possible: number;
    due_at: string | null;
    course_id: number;
    name: string;
    html_url: string;
}

export interface AssignmentType {
    assignmentId: number;
    assignmentName: string;
    description: string;
    dueAt: string;
    courseId: number;
    pointsPossible: number;
    url: string;
}

export interface PartialCourse {
    courseId: number;
    schoolId: number;
}

export type JWTData = {
    userId: string;
    email: string;
    canvasBaseUrl: string;
    canvasToken: string;
} & JWTPayload;

// zod types

export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    course_code: z.string(),
});

export type CanvasCourse = z.infer<typeof CanvasCourseSchema>;