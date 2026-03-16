import type { Job, QueueOptions } from "bullmq";

import type { db } from "@/lib/types.js";
import type { EnrollmentJob } from "@/modules/ingestion/background/domain/types.js";
import type { WorkerDeps } from "@/modules/ingestion/domain/types.js";

import { CanvasFetchWorkerScope } from "@/modules/ingestion/scopes/canvasFetchWorkerScope.js";
import { CheckRunCompletion } from "@/modules/ingestion/scopes/checkRunCompletionScope.js";
import { CoursePlanWorkerScope } from "@/modules/ingestion/scopes/CoursePlanWorker.scope.js";
import { DbWriteScope } from "@/modules/ingestion/scopes/dbWriteWorkerScope.js";
import { EnrollmentWorkerScope } from "@/modules/ingestion/scopes/EnrollmentWorker.scope.js";
import { FullIngestionScope } from "@/modules/ingestion/scopes/FullIngestionScope.js";
import { ProcessWorkerScope } from "@/modules/ingestion/scopes/processWorkerScope.js";

import type { AppContainerDeps } from "../types.js";

import { buildQueues } from "../buildQueues.js";
import { buildRepos } from "../buildRepos.js";

export function buildWorkerContainer(
    db: db,
    queueOptions: QueueOptions,
    deps: AppContainerDeps,
) {
    const repos = buildRepos(db);
    const queues = buildQueues(queueOptions);

    return {
        repos,
        queues,
        queueOptions,

        createEnrollmentWorkerScope(job: Job<EnrollmentJob>) {
            return new EnrollmentWorkerScope({
                job,
                ingestionRunsRepo: repos.ingestionRuns,
                clientFactory: deps.clientFactory,
                canvasFactory: deps.canvasFactory,
                enrollmentsRepo: repos.enrollments,
                ingestionTasksRepo: repos.ingestionTasks,
                coursesQueue: queues.courses,
            });
        },

        createCoursePlanWorkerScope(job: Job<WorkerDeps>) {
            return new CoursePlanWorkerScope({
                job,
                courses: repos.courses,
                ingestionTasks: repos.ingestionTasks,
                ingestionRuns: repos.ingestionRuns,
                courseActivityStream: repos.courseActivityStream,
                courseChange: queues.courseChange,
                courseFullIngest: queues.courseFullIngest,
                checkRunCompletion: queues.checkRunCompletion,
                canvasFactory: deps.canvasFactory,
                clientFactory: deps.clientFactory,
            });
        },

        createCanvasFetchScope(job: Job<WorkerDeps>) {
            return new CanvasFetchWorkerScope({
                job,
                ingestionTasks: repos.ingestionTasks,
                ingestionRun: repos.ingestionRuns,
                canvasRawDocuments: repos.canvasRawDocuments,
                courseInfo: repos.courseInfo,
                clientFactory: deps.clientFactory,
                canvasFactory: deps.canvasFactory,
                processQueue: queues.process,
                dbWrite: queues.dbWrite,
                checkRunCompletion: queues.checkRunCompletion,
            });
        },

        createProcessScope(job: Job<WorkerDeps>) {
            return new ProcessWorkerScope({
                job,
                ingestionTasks: repos.ingestionTasks,
                courseInfo: repos.courseInfo,
                canvasRawDoc: repos.canvasRawDocuments,
                sanitizeHtml: deps.sanitizeHtml,
                dbWrite: queues.dbWrite,
                checkRunCompletion: queues.checkRunCompletion,
            });
        },

        createDbWriteScope(job: Job<WorkerDeps>) {
            return new DbWriteScope({
                job,
                ingestionTasks: repos.ingestionTasks,
                canvasRawDocuments: repos.canvasRawDocuments,
                courseInfo: repos.courseInfo,
                processQueue: queues.process,
                checkRun: queues.checkRunCompletion,
                dbWrite: queues.dbWrite,
                enrollments: repos.enrollments,
                courses: repos.courses,
                ingestonRuns: repos.ingestionRuns,
            });
        },

        createCompletionScope(job: Job<{ ingestionRunId: string }>) {
            return new CheckRunCompletion({
                job,
                ingestionTasks: repos.ingestionTasks,
                ingestionRuns: repos.ingestionRuns,
                pubSubService: deps.pubSubService,
            });
        },

        createFullIngestionScope(job: Job<WorkerDeps>) {
            return new FullIngestionScope({
                job,
                ingestionTaskRepo: this.repos.ingestionTasks,
                ingestionRunRepo: this.repos.ingestionRuns,
                fetchQueue: this.queues.canvasFetch,
            });
        },
    };
}