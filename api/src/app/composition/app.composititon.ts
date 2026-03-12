import type { Queue as BullQueue, Worker as BullWorker, Job, Processor, QueueOptions } from "bullmq";

import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/repos/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/repos/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { IEnrollmentRepo } from "@/infrastructure/interfaces/repos/enrollment.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/repos/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";
import type { ISchoolRepository } from "@/infrastructure/interfaces/repos/school.repo.interface.js";
import type { IUserRepository } from "@/infrastructure/interfaces/repos/user.repo.interface.js";
import type { db, JWTData } from "@/lib/types.js";
import type { EnrollmentJob } from "@/modules/ingestion/background/domain/types.js";
import type { CanvasFetchWorkerDeps, checkRunCompletionDeps, DbWriteScopeDeps, ProcessWorkerDeps, WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { DrizzleCourseActivityStreamRepository } from "@/infrastructure/drizzle/repos/drizzle.CAS.repo.js";
import { DrizzleCourseInfoRepository } from "@/infrastructure/drizzle/repos/drizzle.courseInfo.repo.js";
import { DrizzleCourseRepository } from "@/infrastructure/drizzle/repos/drizzle.courses.repo.js";
import { DrizzleCanvasRawDocuments } from "@/infrastructure/drizzle/repos/drizzle.CRD.repo.js";
import { DrizzleEnrollmentRepository } from "@/infrastructure/drizzle/repos/drizzle.enrollments.repo.js";
import { DrizzleIngestionTasksRepo } from "@/infrastructure/drizzle/repos/drizzle.ingestionTasks.repo.js";
import { DrizzleIngestionRunRepository } from "@/infrastructure/drizzle/repos/drizzle.IR.repo.js";
import { DrizzleSchoolRepository } from "@/infrastructure/drizzle/repos/drizzle.school.repo.js";
import { DrizzleUserRepository } from "@/infrastructure/drizzle/repos/drizzle.user.repo.js";
import { createQueue } from "@/modules/ingestion/background/factories/queue.factory.js";
import { createWorker } from "@/modules/ingestion/background/factories/worker.factory.js";
import { handleWorkerError } from "@/modules/ingestion/ingestionTasks/domain/errors/handleWorkerError.js";
import { CanvasFetchWorkerScope } from "@/modules/ingestion/scopes/canvasFetchWorkerScope.js";
import { CheckRunCompletion } from "@/modules/ingestion/scopes/checkRunCompletionScope.js";
import { CoursePlanWorkerScope } from "@/modules/ingestion/scopes/CoursePlanWorker.scope.js";
import { DbWriteScope } from "@/modules/ingestion/scopes/dbWriteWorkerScope.js";
import { EnrollmentWorkerScope } from "@/modules/ingestion/scopes/EnrollmentWorker.scope.js";
import { FullIngestionScope } from "@/modules/ingestion/scopes/FullIngestionScope.js";
import { PreIngestionScope } from "@/modules/ingestion/scopes/PreIngestion.scope.js";
import { ProcessWorkerScope } from "@/modules/ingestion/scopes/processWorkerScope.js";

import type { AppContainerDeps, AppQueues, AppRepos } from "./types.js";

export class AppContainer {
    workers: BullWorker[] = [];
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
        checkRunCompletion: BullQueue;
    };

    constructor(
        private readonly db: db,
        private readonly queueOptions: QueueOptions,
        private readonly appContianerDeps: AppContainerDeps,
    ) {
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
            enrollments: createQueue("enrollments", this.queueOptions),
            courses: createQueue("courses", this.queueOptions),
            canvasFetch: createQueue("canvasFetch", this.queueOptions),
            courseFullIngest: createQueue("courseFullIngest", this.queueOptions),
            courseChange: createQueue("courseChange", this.queueOptions),
            process: createQueue("process", this.queueOptions),
            dbWrite: createQueue("dbWrite", this.queueOptions),
            checkRunCompletion: createQueue("checkRunCompletion", this.queueOptions),
        } satisfies AppQueues;
    }

    createPreIngestionScope(ctx: JWTData) {
        return new PreIngestionScope(ctx, this.repos, this.queues, this.appContianerDeps.canvasFactory);
    }

    // Define the scope for the enrollment worker
    // The enrollmet worker scope is the orchestrator for the actual enrollment worker job
    createEnrollmentWorkerScope(job: Job<EnrollmentJob>) {
        return new EnrollmentWorkerScope({
            job,
            ingestionRunsRepo: this.repos.ingestionRuns,
            clientFactory: this.appContianerDeps.clientFactory,
            canvasFactory: this.appContianerDeps.canvasFactory,
            enrollmentsRepo: this.repos.enrollments,
            ingestionTasksRepo: this.repos.ingestionTasks,
            coursesQueue: this.queues.courses,
        });
    }

    // Define the processor method for the worker
    // This is the bridge between app and request scope
    createEnrollmentWorkerProcessor(): Processor<EnrollmentJob, WorkerDeps, string> {
        return async (job: Job<EnrollmentJob, WorkerDeps, string>) => {
            try {
                const scope = this.createEnrollmentWorkerScope(job);
                return await scope.execute();
            }
            catch (error: any) {
            // TODO: make enrollment specific error;
                throw new Error(`Enrollment worker error ${error.message}`);
            }
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
            checkRunCompletion: this.queues.checkRunCompletion,
            canvasFactory: this.appContianerDeps.canvasFactory,
            clientFactory: this.appContianerDeps.clientFactory,
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
            clientFactory: this.appContianerDeps.clientFactory,
            canvasFactory: this.appContianerDeps.canvasFactory,
            processQueue: this.queues.process,
            dbWrite: this.queues.dbWrite,
            checkRunCompletion: this.queues.checkRunCompletion,
        } satisfies CanvasFetchWorkerDeps);
    }

    createCanvasFetchWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            try {
                const scope = this.createCanvasFetchScope(job);
                return await scope.execute();
            }
            catch (error) {
                handleWorkerError(error, job, this.repos.ingestionTasks, job.data.taskId);
            };
        };
    }

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

    createProcessScope(job: Job<WorkerDeps>) {
        return new ProcessWorkerScope({
            job,
            ingestionTasks: this.repos.ingestionTasks,
            courseInfo: this.repos.courseInfo,
            canvasRawDoc: this.repos.canvasRawDocuments,
            sanitizeHtml: this.appContianerDeps.sanitizeHtml,
            dbWrite: this.queues.dbWrite,
            checkRunCompletion: this.queues.checkRunCompletion,
        } satisfies ProcessWorkerDeps);
    }

    createProcessWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            const scope = this.createProcessScope(job);
            return await scope.execute();
        };
    }

    createDbWriteScope(job: Job<WorkerDeps>) {
        return new DbWriteScope({
            job,
            ingestionTasks: this.repos.ingestionTasks,
            canvasRawDocuments: this.repos.canvasRawDocuments,
            courseInfo: this.repos.courseInfo,
            processQueue: this.queues.process,
            checkRun: this.queues.checkRunCompletion,
            dbWrite: this.queues.dbWrite,
            enrollments: this.repos.enrollments,
            courses: this.repos.courses,
            ingestonRuns: this.repos.ingestionRuns,
        } satisfies DbWriteScopeDeps);
    }

    createDbWriteWorkerProcessor() {
        return async (job: Job<WorkerDeps>) => {
            const scope = this.createDbWriteScope(job);
            return await scope.execute();
        };
    }

    createCompletionScope(job: Job<{ ingestionRunId: string }>) {
        return new CheckRunCompletion({
            job,
            ingestionTasks: this.repos.ingestionTasks,
            ingestionRuns: this.repos.ingestionRuns,
        } satisfies checkRunCompletionDeps);
    }

    createCompletionWorkerProcessor() {
        return async (job: Job<{ ingestionRunId: string }>) => {
            const scope = this.createCompletionScope(job);
            return await scope.execute();
        };
    }

    // Method that gets called during app bootstap to start the workers
    startWorkers() {
        // Retain a refrenece to them so when shut them down gracefully
        this.workers = [
            createWorker("enrollments", this.createEnrollmentWorkerProcessor(), this.queueOptions, 5),
            createWorker("courses", this.createCoursePlanWorkerProcessor(), this.queueOptions, 5),
            createWorker("canvasFetch", this.createCanvasFetchWorkerProcessor(), this.queueOptions, 5),
            createWorker("courseFullIngest", this.createFullIngestionWorkerProcessor(), this.queueOptions, 5),
            createWorker("process", this.createProcessWorkerProcessor(), this.queueOptions, 5),
            createWorker("dbWrite", this.createDbWriteWorkerProcessor(), this.queueOptions, 5),
            createWorker("checkRunCompletion", this.createCompletionWorkerProcessor(), this.queueOptions, 5),
        ];
    }

    async shutdownWorkers() {
        if (this.workers.length > 0) {
            this.workers.forEach(async worker => await worker.close());
        }
    }
};