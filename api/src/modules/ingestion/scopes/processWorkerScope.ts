import type { ProcessWorkerDeps } from "../domain/types.js";
import type { SanitizedSyllabus } from "../ingestionTasks/domain/types.js";

import { ClaimIngestionTask } from "../ingestionTasks/applications/useCases/claimIngestion.js";

export class ProcessWorkerScope {
    private readonly claimIngestionTask: ClaimIngestionTask;
    constructor(
        private readonly prcoessWorkerDeps: ProcessWorkerDeps,
    ) {
        this.claimIngestionTask = new ClaimIngestionTask(this.prcoessWorkerDeps.ingestionTasks);
    }

    async execute() {
        const { ingestionRunId, taskId } = this.prcoessWorkerDeps.job.data;
        const task = await this.claimIngestionTask.execute(taskId);

        if (!task) {
            // Task has already been claimed
            return;
        }

        switch (task.kind) {
            case "process:Syllabus": {
                const rawSyllabus = await this.prcoessWorkerDeps.courseInfo.fetchRawSyllabus(task.entityId);
                const sanitizedSyllabus = this.prcoessWorkerDeps.sanitizeHtml.sanitize(rawSyllabus);
                const plainText = this.prcoessWorkerDeps.sanitizeHtml.convertToPlainText(rawSyllabus);
                const syllabusHash = Bun.hash(rawSyllabus).toString();
                const syllabusObj = {
                    syllabusId: task.entityId,
                    sanitizedSyllabus,
                    plainText,
                    syllabusHash,
                } satisfies SanitizedSyllabus;
                const docId = await this.prcoessWorkerDeps.canvasRawDoc.insertCanvasRawDocument("syllabus", String(task.canvasCourseId), JSON.stringify(syllabusObj), new Date(), task.canvasCourseId, task.schoolId);
                const newWriteTask = await this.prcoessWorkerDeps.ingestionTasks.insertWriteSyllabusTask(ingestionRunId, "write:Syllabus", task.canvasCourseId, task.schoolId, "rawDoc", docId);
                const vectorizeSyllabusTaskId = await this.prcoessWorkerDeps.ingestionTasks.insertVectorizeSyllabus(ingestionRunId, "vectorize:Syllabus", task.canvasCourseId, task.schoolId, "syllabus", syllabusObj.syllabusId);
                await this.prcoessWorkerDeps.dbWrite.add("write", { ingestionRunId, taskId: newWriteTask });
                await this.prcoessWorkerDeps.vectorization.add("vectorization", { ingestionRunId, taskId: vectorizeSyllabusTaskId });
                await this.prcoessWorkerDeps.ingestionTasks.updateTaskStatus("success", taskId);
                await this.prcoessWorkerDeps.checkRunCompletion.add("check", { ingestionRunId });
                break;
            };
        }
    }
}