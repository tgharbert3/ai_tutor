import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import type { PinoLogger } from "hono-pino";
import type { JWTPayload } from "jose";

import * as z from "zod";

import type { ServiceContainer } from "@/modules/services.container.js";

import type * as schema from "../db/schema.js";

export type AppBindings = {
    Variables: {
        logger: PinoLogger;
        services: ServiceContainer;
        user: JWTData;
    };
};

export type AppEnv = "development" | "production" | "test";

export type db = PgliteDatabase<typeof schema> | NodePgDatabase<typeof schema>;

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

export type Enrollment = {
    canvasUserId: number;
    canvasCourseId: number;
    enrollmentState: string;
};

export type PartialCourse = {
    courseId: number;
    schoolId: number;
};

export type PartialUser = {
    id: string;
    email: string;
    schoolId: number;
};

export type JWTData = {
    userId: string;
    email: string;
    fullurl: string;
    canvasToken: string;
} & JWTPayload;

// Bull Jobs

export type fetchAssignmentJob = {
    apiToken: string;
    canvasBaseUrl: string;
    courseId: number;
};

export type fetchEnrollmentsJob = {
    apiToken: string;
    canvasBaseUrl: string;
    userId: string;
    schoolId: number;
};

// zod types

export const CanvasCourseSchema = z.object({
    id: z.number(),
    name: z.string(),
    course_code: z.string(),
});

export type CanvasCourse = z.infer<typeof CanvasCourseSchema>;