import type { IngestionTaskKind } from "@/modules/ingestionTasks/domain/types.js";

import type { FullIngestionScopeDeps } from "../domain/types.js";

export class FullIngestionScope {
    constructor(
        private readonly fullIngestionScopeDeps: FullIngestionScopeDeps,
    ) {
    };

    async execute() {
        const { ingestionRunId, taskId } = this.fullIngestionScopeDeps.job.data;
        const task = await this.fullIngestionScopeDeps.ingestionTaskRepo.claimCourseIngestionTask(taskId);

        // Items that the CanvasFetch worker needs to fetch.
        const itemsToFetch: IngestionTaskKind[] = [
            "fetchSyllabus",
            // fetchAllAssignments
        ];

        const taskIds = await this.fullIngestionScopeDeps.ingestionTaskRepo.insertCanvasFetchTaskForFullIngestion(ingestionRunId, itemsToFetch, task.courseId, task.schoolId);

        await Promise.all(
            taskIds.map(taskId =>
                this.fullIngestionScopeDeps.fetchQueue.add("fetch", { ingestionRunId, taskId }),
            ),
        );

        await this.fullIngestionScopeDeps.ingestionTaskRepo.updateTaskStatus("success", taskId);
        await this.fullIngestionScopeDeps.job.updateProgress(100);
    };
}