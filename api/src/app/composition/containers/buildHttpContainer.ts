import type { QueueOptions } from "bullmq";

import type { db, JWTData } from "@/lib/types.js";

import { PreIngestionScope } from "@/modules/ingestion/scopes/PreIngestion.scope.js";

import type { AppContainerDeps } from "../types.js";

import { buildQueues } from "../buildQueues.js";
import { buildRepos } from "../buildRepos.js";

export type HttpContainer = ReturnType<typeof buildHttpContainer>;
export function buildHttpContainer(
    db: db,
    queueOptions: QueueOptions,
    deps: AppContainerDeps,
) {
    const repos = buildRepos(db);
    const queues = buildQueues(queueOptions);

    return {
        repos,

        createPreIngestionScope(ctx: JWTData) {
            return new PreIngestionScope(
                ctx,
                repos,
                queues,
                deps.canvasFactory,
            );
        },

        getPubSubService() {
            return deps.pubSubService;
        },

    // later:
    // createCreateCourseUseCase()
    // createUpdateCourseUseCase()
    // createDeleteCourseUseCase()
    // createGetRunStatusQuery()
    };
}