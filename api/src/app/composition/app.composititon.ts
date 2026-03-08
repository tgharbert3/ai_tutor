import type { Queue as BullQueue, Worker as BullWorker, Job, Processor, QueueOptions } from "bullmq";

import type { CanvasApiPortFactory } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/enrollment.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/user.repo.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";
import type { db, JWTData } from "@/lib/types.js";
import type { EnrollmentJob } from "@/modules/ingestion/background/domain/types.js";
import type { CanvasFetchWorkerDeps, WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { DrizzleCourseActivityStreamRepository } from "@/infrastructure/drizzle/repos/drizzle.CAS.repo.js";
import { DrizzleCourseInfoRepository } from "@/infrastructure/drizzle/repos/drizzle.courseInfo.repo.js";
import { DrizzleCourseRepository } from "@/infrastructure/drizzle/repos/drizzle.courses.repo.js";
import { DrizzleCanvasRawDocuments } from "@/infrastructure/drizzle/repos/drizzle.CRD.repo.js";
import { DrizzleEnrollmentRepository } from "@/infrastructure/drizzle/repos/drizzle.enrollments.repo.js";
import { DrizzleIngestionTasksRepo } from "@/infrastructure/drizzle/repos/drizzle.ingestionTasks.repo.js";
import { DrizzleIngestionRunRepository } from "@/infrastructure/drizzle/repos/drizzle.IR.repo.js";
import { DrizzleSchoolRepository } from "@/infrastructure/drizzle/repos/drizzle.school.repo.js";
import { DrizzleUserRepository } from "@/infrastructure/drizzle/repos/drizzle.user.repo.js";
import { ClientFactory } from "@/infrastructure/internal/fetch.client.js";
import { createQueue } from "@/modules/ingestion/background/factories/queue.factory.js";
import { createWorker } from "@/modules/ingestion/background/factories/worker.factory.js";
import { handleWorkerError } from "@/modules/ingestion/ingestionTasks/domain/errors/handleWorkerError.js";
import { CanvasFetchWorkerScope } from "@/modules/ingestion/scopes/canvasFetchWorkerScope.js";
import { CoursePlanWorkerScope } from "@/modules/ingestion/scopes/CoursePlanWorker.scope.js";
import { EnrollmentWorkerScope } from "@/modules/ingestion/scopes/EnrollmentWorker.scope.js";
import { FullIngestionScope } from "@/modules/ingestion/scopes/FullIngestionScope.js";
import { PreIngestionScope } from "@/modules/ingestion/scopes/PreIngestion.scope.js";

import type { AppQueues, AppRepos } from "./types.js";

export class AppContainer {
    workers: BullWorker[] = [];
    readonly canvasFactory: CanvasApiPortFactory;
    readonly clientFacotry: ClientApiPortFactory;
    public readonly repos: {
        users: IUserRepository;
        schools: ISchoolRepository;
        ingestionRuns: IIngestionRunRepository;
        enrollments: IEnrollmentRepo;
        courses: ICoursesRepository;
        ingestionTasks: IIngestionTaskRepository;
        courseActivityStream: ICourseActivityStreamRepository;
        canvasRawDocuments: ICanvasRawDocumentsRepository;
        courseInfo: ICourseInfoRepository;
    };

    public readonly queues: {
        enrollments: BullQueue;
        courses: BullQueue;
        canvasFetch: BullQueue;
        courseFullIngest: BullQueue;
        courseChange: BullQueue;
        process: BullQueue;
        dbWrite: BullQueue;
    };

    constructor(
        private readonly db: db,
        private readonly redis: QueueOptions,
    ) {
        // Have to use a factory because each client needs to be request scoped
        this.canvasFactory = new CanvasClientFactory();
        this.clientFacotry = new ClientFactory();

        this.repos = {
            users: new DrizzleUserRepository(this.db),
            schools: new DrizzleSchoolRepository(this.db),
            ingestionRuns: new DrizzleIngestionRunRepository(this.db),
            enrollments: new DrizzleEnrollmentRepository(this.db),
            courses: new DrizzleCourseRepository(this.db),
            ingestionTasks: new DrizzleIngestionTasksRepo(this.db),
            courseActivityStream: new DrizzleCourseActivityStreamRepository(this.db),
            canvasRawDocuments: new DrizzleCanvasRawDocuments(this.db),
            courseInfo: new DrizzleCourseInfoRepository(this.db),
        } satisfies AppRepos;

        this.queues = {
            enrollments: createQueue("enrollments", this.redis),
            courses: createQueue("courses", this.redis),
            canvasFetch: createQueue("canvasFetch", this.redis),
            courseFullIngest: createQueue("courseFullIngest", this.redis),
            courseChange: createQueue("courseChange", this.redis),
            process: createQueue("mapping", this.redis),
            dbWrite: createQueue("dbWrite", this.redis),
        } satisfies AppQueues;
    }

    createPreIngestionScope(ctx: JWTData) {
        return new PreIngestionScope(ctx, this.repos, this.queues, this.canvasFactory);
    }

    // Define the scope for the enrollment worker
    // The enrollmet worker scope is the orchestrator for the actual enrollment worker job
    createEnrollmentWorkerScope(job: Job<EnrollmentJob>) {
        return new EnrollmentWorkerScope({
            job,
            ingestionRunsRepo: this.repos.ingestionRuns,
            clientFactory: this.clientFacotry,
            canvasFactory: this.canvasFactory,
            enrollmentsRepo: this.repos.enrollments,
            ingestionTasksRepo: this.repos.ingestionTasks,
            coursesQueue: this.queues.courses,
        });
    }

    // Define the processor method for the worker
    // This is the bridge between app and request scope
    createEnrollmentWorkerProcessor(): Processor<EnrollmentJob, void, string> {
        return async (job: Job<EnrollmentJob, void, string>) => {
            const scope = this.createEnrollmentWorkerScope(job);
            return await scope.execute();
        };
    };

    createCoursePlanWorkerScope(job: Job<WorkerDeps>) {
        return new CoursePlanWorkerScope({
            job,
            courses: this.repos.courses,
            ingestionTasks: this.repos.ingestionTasks,
            ingestionRuns: this.repos.ingestionRuns,
            courseActivityStream: this.repos.courseActivityStream,
            courseChange: this.queues.courseChange,
            courseFullIngest: this.queues.courseFullIngest,
            canvasFactory: this.canvasFactory,
            clientFactory: this.clientFacotry,
        });
    }

    // TODO: possibly added a check to make sure there are course Ids
    createCoursePlanWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            try {
                const scope = this.createCoursePlanWorkerScope(job);
                return await scope.execute();
            }
            catch (e) {
                handleWorkerError(e, job, this.repos.ingestionTasks, job.data.taskId);
            }
        };
    }

    createCanvasFetchScope(job: Job<WorkerDeps>) {
        return new CanvasFetchWorkerScope({
            job,
            ingestionTasks: this.repos.ingestionTasks,
            ingestionRun: this.repos.ingestionRuns,
            canvasRawDocuments: this.repos.canvasRawDocuments,
            courseInfo: this.repos.courseInfo,
            clientFactory: this.clientFacotry,
            canvasFactory: this.canvasFactory,
            processQueue: this.queues.process,
            dbWrite: this.queues.dbWrite,
        } satisfies CanvasFetchWorkerDeps);
    }

    createCanvasFetchWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            const scope = this.createCanvasFetchScope(job);
            return await scope.execute();
        };
    };

    createFullIngestionScope(job: Job<WorkerDeps>) {
        return new FullIngestionScope({
            job,
            ingestionTaskRepo: this.repos.ingestionTasks,
            ingestionRunRepo: this.repos.ingestionRuns,
            fetchQueue: this.queues.canvasFetch,
        });
    }

    createFullIngestionWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            const scope = this.createFullIngestionScope(job);
            return await scope.execute();
        };
    }

    // Method that gets called during app bootstap to start the workers
    startWorkers() {
        // Retain a refrenece to them so when shut them down gracefully
        this.workers = [
            createWorker("enrollments", this.createEnrollmentWorkerProcessor(), this.redis, 1),
            createWorker("courses", this.createCoursePlanWorkerProcessor(), this.redis, 1),
            createWorker("canvasFetch", this.createCanvasFetchWorkerProcessor(), this.redis, 1),
            createWorker("courseFullIngest", this.createFullIngestionWorkerProcessor(), this.redis, 1),
        ];
    }
};