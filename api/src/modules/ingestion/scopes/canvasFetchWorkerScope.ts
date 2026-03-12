import type { Job } from "bullmq";

import type { CanvasCourse } from "@/infrastructure/canvas/types.js";

import { FetchUsersCanvasToken } from "@/infrastructure/internal/application/fetchUsersCanvasToken.useCase.js";

import type { CanvasFetchWorkerDeps } from "../domain/types.js";

import { UnhandledTaskError } from "../ingestionTasks/domain/errors/errorsTypes.js";

export class CanvasFetchWorkerScope {
    private fetchUsersCanvasToken: FetchUsersCanvasToken;
    constructor(
        private readonly canvasFetchWorkerDeps: CanvasFetchWorkerDeps,
    ) {
        this.fetchUsersCanvasToken = new FetchUsersCanvasToken(this.canvasFetchWorkerDeps.clientFactory);
    };

    async execute() {
        const { ingestionRunId, taskId } = this.canvasFetchWorkerDeps.job.data;
        const task = await this.canvasFetchWorkerDeps.ingestionTasks.claimIngestionTask(taskId);
        const clientDeps = await this.canvasFetchWorkerDeps.ingestionRun.fetchUserIdAndUrl(ingestionRunId, task.schoolId);
        const usersCanvasToken = await this.fetchUsersCanvasToken.execute(clientDeps.userId);
        const canvasClient = this.canvasFetchWorkerDeps.canvasFactory.create({ apiToken: usersCanvasToken, canvasBaseUrl: clientDeps.canvasBaseUrl });
        switch (task.kind) {
            // case "fetchAllAssignments":
            case "fetch:CourseInfo": {
                const courseInfo = await canvasClient.getCourseInfo(task.canvasCourseId);
                await this.enqueueDbWriteForCourse(courseInfo, task.schoolId, task.canvasCourseId, ingestionRunId);
                await this.markJobComplete(taskId, this.canvasFetchWorkerDeps.job);
                break;
            }
            default: {
                throw new UnhandledTaskError(`Unhandled Task:${taskId}`);
            }
        }
    }

    private async enqueueDbWriteForCourse(courseInfo: CanvasCourse, schoolId: number, canvasCourseId: number, ingestionRunId: string) {
        const insertCourseDocId = await this.canvasFetchWorkerDeps.canvasRawDocuments.insertCanvasRawDocument(
            "rawDoc",
            String(canvasCourseId),
            JSON.stringify(courseInfo),
            new Date(),
            canvasCourseId,
            schoolId,
        );
        const insertCourseTaskId = await this.canvasFetchWorkerDeps.ingestionTasks.insertDbWriteTask(ingestionRunId, "write:NewCourse", canvasCourseId, schoolId, insertCourseDocId, "rawDoc");
        await this.canvasFetchWorkerDeps.dbWrite.add("write", { ingestionRunId, taskId: insertCourseTaskId });
        return { ingestionRunId, insertCourseTaskId };
    }

    private async markJobComplete(taskId: string, job: Job) {
        await this.canvasFetchWorkerDeps.ingestionTasks.updateTaskStatus("success", taskId);
        await job.updateProgress(100);
        await this.canvasFetchWorkerDeps.checkRunCompletion.add("check", { ingestionRunId: job.data.ingestionRunId });
    }
}