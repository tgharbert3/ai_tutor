import type { Job, Processor, QueueOptions, Worker } from "bullmq";

import { FlowProducer } from "bullmq";

import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/cavans.api.port.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { db, JWTData } from "@/lib/types.js";
import type { EnrollmentJob } from "@/modules/background/domain/types.js";
import type { EnrollmentQueuePort } from "@/modules/background/enrollments/ports/enrollment.queue.port.js";
import type { EnrollmentRepoPort } from "@/modules/enrollments/ports/enrollment.port.js";
import type { IngestionRunPort } from "@/modules/ingestionRuns/ports/ingestionRun.port.js";
import type { SchoolRepositoryPort } from "@/modules/schools/ports/school.repo.port.js";
import type { UserRepositoryPort } from "@/modules/users/ports/user.repo.port.js";

import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { ClientFactory } from "@/infrastructure/internal/fetch.client.js";
import { BullMQEnrollmentQueue } from "@/modules/background/enrollments/enrollment.queue.js";
import { createWorker } from "@/modules/background/workers/worker.factory.js";
import { DrizzleEnrollmentRepository } from "@/modules/enrollments/adapters/drizzle.enrollments.repo.js";
import { EnrollmentWorkerScope } from "@/modules/ingestion/EnrollmentWorker.scope.js";
import { DrizzleIngestionRunRepository } from "@/modules/ingestionRuns/adapters/drizzle.IR.repo.js";
import { DrizzleSchoolRepository } from "@/modules/schools/adapters/drizzle.school.repo.js";
import { DrizzleUserRepository } from "@/modules/users/adapters/drizzle.user.repo.js";

import { PreIngestionScope } from "../../modules/ingestion/PreIngestion.scope.js";

export class AppContainer {
    workers: Worker[] = [];
    readonly canvasFactory: CanvasApiPortFactory;
    readonly clientFacotry: ClientApiPortFactory;
    public readonly repos: {
        users: UserRepositoryPort;
        schools: SchoolRepositoryPort;
        ingestionRuns: IngestionRunPort;
        enrollments: EnrollmentRepoPort;
    };

    public readonly queues: {
        enrollmentQueue: EnrollmentQueuePort;
    };

    constructor(
        private readonly db: db,
        private readonly redis: QueueOptions,
    ) {
        // Have to use a factory because each client needs to be request scoped
        this.canvasFactory = new CanvasClientFactory();
        this.clientFacotry = new ClientFactory();
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

    createPreIngestionScope(ctx: JWTData) {
        return new PreIngestionScope(ctx, this.repos, this.queues, this.canvasFactory);
    }

    // Define the scope for the enrollment worker
    // The enrollmet worker scope is the orchestrator for the actual enrollment worker job
    createEnrollmentWorkerScope(jobData: EnrollmentJob) {
        return new EnrollmentWorkerScope({
            jobData,
            ingestionRunsRepo: this.repos.ingestionRuns,
            clientFactory: this.clientFacotry,
            canvasFactory: this.canvasFactory,
            enrollmentsRepo: this.repos.enrollments,
        });
    }

    // Define the processor method for the worker
    // This is the bridge between app and request scope
    createWorkerProcessor(): Processor {
        return async (job: Job<EnrollmentJob>) => {
            const scope = this.createEnrollmentWorkerScope(job.data);
            return await scope.execute();
        };
    };

    // Method that gets called during app bootstap to start the workers
    startWorkers() {
        // Retain a refrenece to them so when shut them down gracefully
        this.workers = [
            createWorker("enrollment", this.createWorkerProcessor(), this.redis, 1),
        ];
    }
};