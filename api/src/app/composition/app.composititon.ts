import type { QueueOptions } from "bullmq";

import { FlowProducer } from "bullmq";

import type { db } from "@/lib/types.js";
import type { EnrollmentQueuePort } from "@/modules/background/enrollments/ports/enrollment.queue.port.js";
import type { EnrollmentRepoPort } from "@/modules/enrollments/ports/enrollment.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";
import type { SchoolRepositoryPort } from "@/modules/schools/ports/school.repo.port.js";
import type { UserRepositoryPort } from "@/modules/users/ports/user.repo.port.js";

import { BullMQEnrollmentQueue } from "@/modules/background/enrollments/enrollment.queue.js";
import { DrizzleEnrollmentRepository } from "@/modules/enrollments/adapters/drizzle.enrollments.repo.js";
import { DrizzleIngestionRunRepository } from "@/modules/ingestionRuns/adapters/drizzle.IR.repo.js";
import { DrizzleSchoolRepository } from "@/modules/schools/adapters/drizzle.school.repo.js";
import { DrizzleUserRepository } from "@/modules/users/adapters/drizzle.user.repo.js";

import type { Context } from "./types.js";

import { IngestionScope } from "../../modules/ingestion/Ingestion.scope.js";

export class AppContainer {
    public readonly repos: {
        users: UserRepositoryPort;
        schools: SchoolRepositoryPort;
        ingestionRun: IngestionRunPort;
        enrollments: EnrollmentRepoPort;
    };

    public readonly queues: {
        enrollmentQueue: EnrollmentQueuePort;
    };

    constructor(
        private readonly db: db,
        private readonly redis: QueueOptions,
    ) {
        const enrollmentFlowProducer = new FlowProducer({ connection: this.redis });

        this.repos = {
            users: new DrizzleUserRepository(this.db),
            schools: new DrizzleSchoolRepository(this.db),
            ingestionRuns: new DrizzleIngestionRunRepository(this.db),
            enrollments: new DrizzleEnrollmentRepository(this.db),
        };

        this.queues = {
            enrollmentQueue: new BullMQEnrollmentQueue(enrollmentFlowProducer),
        };
    }

    createIngestionScope(ctx: Context) {
        return new IngestionScope(ctx, this.repos, this.queues, this.redis);
    }
};