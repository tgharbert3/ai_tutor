import type { IngestionTaskKind } from "@/modules/ingestion/ingestionTasks/domain/types.js";

import type { FullIngestionScopeDeps } from "../domain/types.js";

export class FullIngestionScope {
    constructor(
        private readonly fullIngestionScopeDeps: FullIngestionScopeDeps,
    ) {
    };

    async execute() {
        const { ingestionRunId, taskId: parentJobTaskId } = this.fullIngestionScopeDeps.job.data;
        const task = await this.fullIngestionScopeDeps.ingestionTaskRepo.claimIngestionTask(parentJobTaskId);
        // Items that the CanvasFetch worker needs to fetch.
        const itemsToFetch: IngestionTaskKind[] = [
            "fetch:CourseInfo",
            // "fetch:AllAssignments",
        ];

        const taskIds = await this.fullIngestionScopeDeps.ingestionTaskRepo.insertCanvasFetchTaskForFullIngestion(
            ingestionRunId,
            itemsToFetch,
            task.canvasCourseId,
            task.schoolId,
        );
        await Promise.all(
            taskIds.map(taskId =>
                this.fullIngestionScopeDeps.fetchQueue.add("fetch", { ingestionRunId, taskId }),
            ),
        );

        await this.fullIngestionScopeDeps.ingestionTaskRepo.updateTaskStatus("success", parentJobTaskId);
        await this.fullIngestionScopeDeps.job.updateProgress(100);
        // TODO: update the deps tp accept array
        return { ingestionRunId, taskId: taskIds[0] };
    };
}