import type { Job } from "bullmq";

import type { DbWriteScopeDeps } from "../domain/types.js";

export class DbWriteScope {
    constructor(
        private readonly dbWriteScopeDeps: DbWriteScopeDeps,
    ) {}

    async execute() {
        const { ingestionRunId, taskId } = this.dbWriteScopeDeps.job.data;
        const task = await this.dbWriteScopeDeps.ingestionTasks.claimIngestionTask(taskId);
        const rawDoc = await this.dbWriteScopeDeps.canvasRawDocuments.fetchRawDocument(task.entityId);
        // TODO: this is an any. make it typed
        const payload = JSON.parse(rawDoc.payload);

        switch (task.kind) {
            case "write:CourseInfo": {
                const { syllabusId } = await this.dbWriteScopeDeps.courseInfo.insertCourseInfo(payload.course_code, payload.name, rawDoc.courseId, payload.syllabus_body, payload.tabs);
                const syllabusTaskId = await this.dbWriteScopeDeps.ingestionTasks.insertProcessSyllabusTask(ingestionRunId, "process:Syllabus", rawDoc.courseId, rawDoc.schoolId, "syllabus", syllabusId);
                await this.dbWriteScopeDeps.processQueue.add("process", { ingestionRunId, taskId: syllabusTaskId });
                await this.markJobComplete(taskId, this.dbWriteScopeDeps.job);
                // TODO: Enqueue a checkIngestionRunCompletion job
                break;
            };
            case "write:Syllabus": {
                const { syllabusId, sanitizedSyllabus, plainText, syllabusHash } = payload;
                await this.dbWriteScopeDeps.courseInfo.insertSyllabus(syllabusId, sanitizedSyllabus, plainText, syllabusHash);
                await this.markJobComplete(taskId, this.dbWriteScopeDeps.job);
                // TODO: Enqueue a checkIngestionRunCompletion job
                break;
            }
        }
    }

    private async markJobComplete(taskId: string, job: Job) {
        await this.dbWriteScopeDeps.ingestionTasks.updateTaskStatus("success", taskId);
        await job.updateProgress(100);
    }
}