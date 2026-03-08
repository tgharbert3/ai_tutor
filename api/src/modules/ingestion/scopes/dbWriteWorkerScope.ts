import type { DbWriteScopeDeps } from "../domain/types.js";

export class DbWriteScope {
    constructor(
        private readonly dbWriteScopeDeps: DbWriteScopeDeps,
    ) {}

    async execute() {
        const { ingestionRunId, taskId } = this.dbWriteScopeDeps.job.data;
        const task = await this.dbWriteScopeDeps.ingestionTasks.claimIngestionTask(taskId);
        const rawDoc = await this.dbWriteScopeDeps.canvasRawDocuments.fetchRawDocument(task.entityId);
        const payload = JSON.parse(rawDoc.payload);

        switch (task.kind) {
            case "write:CourseInfo": {
                const { courseInfoId, syllabusId } = await this.dbWriteScopeDeps.courseInfo.insertCourseInfo(payload.course_code, payload.name, rawDoc.courseId, payload.syllabus_body, payload.tabs);
                const syllabusTaskId = await this.dbWriteScopeDeps.ingestionTasks.insertProcessSyllabusTask(ingestionRunId, "process:Syllabus", rawDoc.courseId, rawDoc.schoolId, "syllabus", syllabusId);
                await this.dbWriteScopeDeps.processQueue.add("process", { ingestionRunId, taskId: syllabusTaskId });
                const processTabsTaskId = await this.dbWriteScopeDeps.ingestionTasks.insertProcessCourseTabsTask(ingestionRunId, "process:Tabs", rawDoc.courseId, rawDoc.schoolId, "tabs", courseInfoId);
                await this.dbWriteScopeDeps.processQueue.add("process", { ingestionRunId, taskId: processTabsTaskId });
                await this.dbWriteScopeDeps.ingestionTasks.updateTaskStatus("success", taskId);
            }
        }
    }
}