import type { checkRunCompletionDeps } from "../domain/types.js";

export class CheckRunCompletion {
    constructor(
        private readonly checkRunCompletionDeps: checkRunCompletionDeps,
    ) {};

    async execute() {
        const { ingestionRunId } = this.checkRunCompletionDeps.job.data;
        const counts = await this.checkRunCompletionDeps.ingestionTasks.getRunCounts(ingestionRunId);

        await this.checkRunCompletionDeps.pubSubService.publish("ingestion-run-status", JSON.stringify(counts));
        if (counts.queuedCount === 0 && counts.runningCount === 0) {
            // TODO: add a way to send status back to the front end
            await this.checkRunCompletionDeps.ingestionRuns.updateRunStatus("complete", ingestionRunId);
        }
    };
}