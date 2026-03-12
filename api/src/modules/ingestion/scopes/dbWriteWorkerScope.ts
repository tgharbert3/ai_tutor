import type { Job } from "bullmq";

import type { insertCourseType, insertUserEnrollment } from "@/infrastructure/db/schema.js";

import type { DbWriteScopeDeps } from "../domain/types.js";

export class DbWriteScope {
    constructor(
        private readonly dbWriteScopeDeps: DbWriteScopeDeps,
    ) {}

    async execute() {
        const { ingestionRunId, taskId } = this.dbWriteScopeDeps.job.data;
        const task = await this.dbWriteScopeDeps.ingestionTasks.claimIngestionTask(taskId);

        switch (task.kind) {
            case "write:NewCourse": {
                const { rawDoc, payload } = await this.getRawDoc(task.entityId);
                const courseId = await this.dbWriteScopeDeps.courses.insertCourse({
                    schoolId: task.schoolId,
                    canvasCourseId: task.canvasCourseId,
                } satisfies insertCourseType);
                const { syllabusId } = await this.dbWriteScopeDeps.courseInfo.insertCourseInfo(payload.course_code, payload.name, rawDoc.canvasCourseId, payload.syllabus_body, payload.tabs, courseId);
                const syllabusTaskId = await this.dbWriteScopeDeps.ingestionTasks.insertProcessSyllabusTask(ingestionRunId, "process:Syllabus", rawDoc.canvasCourseId, rawDoc.schoolId, "syllabus", syllabusId);
                await this.dbWriteScopeDeps.processQueue.add("process", { ingestionRunId, taskId: syllabusTaskId });

                const writeUserEnrollmentTaskId = await this.dbWriteScopeDeps.ingestionTasks.insertWriteUserEnrollmentTask(ingestionRunId, "write:UserEnrollment", rawDoc.canvasCourseId, rawDoc.schoolId, "course", courseId);
                await this.dbWriteScopeDeps.dbWrite.add("write", { ingestionRunId, taskId: writeUserEnrollmentTaskId });

                await this.markJobComplete(taskId, this.dbWriteScopeDeps.job);
                await this.dbWriteScopeDeps.checkRun.add("check", { ingestionRunId });
                break;
            };
            case "write:Syllabus": {
                const { payload } = await this.getRawDoc(task.entityId);
                const { syllabusId, sanitizedSyllabus, plainText, syllabusHash } = payload;
                await this.dbWriteScopeDeps.courseInfo.insertSyllabus(syllabusId, sanitizedSyllabus, plainText, syllabusHash);
                await this.markJobComplete(taskId, this.dbWriteScopeDeps.job);
                await this.dbWriteScopeDeps.checkRun.add("check", { ingestionRunId });
                break;
            }

            case "write:UserEnrollment": {
                const userId = await this.dbWriteScopeDeps.ingestonRuns.fetchUserId(ingestionRunId);
                await this.dbWriteScopeDeps.enrollments.upsertEnrollment({
                    schoolId: task.schoolId,
                    canvasCourseId: task.canvasCourseId,
                    userId,
                    courseId: Number(task.entityId),
                } satisfies insertUserEnrollment);
                await this.markJobComplete(taskId, this.dbWriteScopeDeps.job);
                await this.dbWriteScopeDeps.checkRun.add("check", { ingestionRunId });
                break;
            }
        }
    }

    private async markJobComplete(taskId: string, job: Job) {
        await this.dbWriteScopeDeps.ingestionTasks.updateTaskStatus("success", taskId);
        await job.updateProgress(100);
    }

    private async getRawDoc(entityId: string) {
        const rawDoc = await this.dbWriteScopeDeps.canvasRawDocuments.fetchRawDocument(entityId);
        // TODO: this is an any. make it typed
        // TODO: this can fail
        return { rawDoc, payload: JSON.parse(rawDoc.payload) };
    }
}