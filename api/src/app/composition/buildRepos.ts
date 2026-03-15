import type { db } from "@/lib/types.js";

import { DrizzleCourseActivityStreamRepository } from "@/infrastructure/drizzle/repos/drizzle.CAS.repo.js";
import { DrizzleCourseInfoRepository } from "@/infrastructure/drizzle/repos/drizzle.courseInfo.repo.js";
import { DrizzleCourseRepository } from "@/infrastructure/drizzle/repos/drizzle.courses.repo.js";
import { DrizzleCanvasRawDocuments } from "@/infrastructure/drizzle/repos/drizzle.CRD.repo.js";
import { DrizzleEnrollmentRepository } from "@/infrastructure/drizzle/repos/drizzle.enrollments.repo.js";
import { DrizzleIngestionTasksRepo } from "@/infrastructure/drizzle/repos/drizzle.ingestionTasks.repo.js";
import { DrizzleIngestionRunRepository } from "@/infrastructure/drizzle/repos/drizzle.IR.repo.js";
import { DrizzleSchoolRepository } from "@/infrastructure/drizzle/repos/drizzle.school.repo.js";
import { DrizzleUserRepository } from "@/infrastructure/drizzle/repos/drizzle.user.repo.js";

import type { AppRepos } from "./types.js";

export function buildRepos(db: db) {
    return {
        users: new DrizzleUserRepository(db),
        schools: new DrizzleSchoolRepository(db),
        ingestionRuns: new DrizzleIngestionRunRepository(db),
        enrollments: new DrizzleEnrollmentRepository(db),
        courses: new DrizzleCourseRepository(db),
        ingestionTasks: new DrizzleIngestionTasksRepo(db),
        courseActivityStream: new DrizzleCourseActivityStreamRepository(db),
        canvasRawDocuments: new DrizzleCanvasRawDocuments(db),
        courseInfo: new DrizzleCourseInfoRepository(db),
    } satisfies AppRepos;
}