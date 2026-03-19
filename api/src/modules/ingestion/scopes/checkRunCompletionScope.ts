import type { checkRunCompletionDeps } from "../domain/types.js";

export class CheckRunCompletion {
    constructor(
        private readonly checkRunCompletionDeps: checkRunCompletionDeps,
    ) {};

    async execute() {
        const { ingestionRunId } = this.checkRunCompletionDeps.job.data;
        const channel = `ingestion-run-status:${ingestionRunId}`;
        const counts = await this.checkRunCompletionDeps.ingestionTasks.getRunCounts(ingestionRunId);

        if (counts.queuedCount === "0" && counts.runningCount === "0") {
            await this.checkRunCompletionDeps.ingestionRuns.updateRunStatus("complete", ingestionRunId);
            const finalCounts = await this.checkRunCompletionDeps.ingestionTasks.getRunCounts(ingestionRunId);
            await this.checkRunCompletionDeps.pubSubService.publish(channel, JSON.stringify({ ...finalCounts, isFinal: true }));
            return;
        };

        await this.checkRunCompletionDeps.pubSubService.publish(channel, JSON.stringify({ ...counts, isFinal: false }));
    };
}