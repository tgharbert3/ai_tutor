import type { ProcessWorkerDeps } from "../domain/types.js";
import type { SanitizedSyllabus } from "../ingestionTasks/domain/types.js";

export class ProcessWorkerScope {
    constructor(
        private readonly prcoessWorkerDeps: ProcessWorkerDeps,
    ) {}

    async execute() {
        const { ingestionRunId, taskId } = this.prcoessWorkerDeps.job.data;
        const task = await this.prcoessWorkerDeps.ingestionTasks.claimIngestionTask(taskId);

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
                const docId = await this.prcoessWorkerDeps.canvasRawDoc.insertCanvasRawDocument("syllabus", String(task.courseId), JSON.stringify(syllabusObj), new Date(), task.courseId, task.schoolId);
                const newWriteTask = await this.prcoessWorkerDeps.ingestionTasks.insertWriteSyllabusTask(ingestionRunId, "write:Syllabus", task.courseId, task.schoolId, "rawDoc", docId);
                await this.prcoessWorkerDeps.dbWrite.add("write", { ingestionRunId, taskId: newWriteTask });
                await this.prcoessWorkerDeps.ingestionTasks.updateTaskStatus("success", taskId);
                break;
            };
        }
    }
}