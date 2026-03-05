import type { Job, Queue } from "bullmq";

import assert from "node:assert/strict";

import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";

import { CreateCanvasClient } from "@/infrastructure/canvas/applications/createCanvasClient.js";

import type { CourseWorkerDeps } from "../domain/types.js";

import { determineCourseExistsInLocalDb } from "../courses/application/diffCourses.js";
import { FetchAllLocalCourses } from "../courses/application/fetchLocalCourses.useCase.js";
import { ClaimIngestionTask } from "../ingestionTasks/applications/useCases/claimIngestion.js";
import { MarkTaskAsSuccess } from "../ingestionTasks/applications/useCases/markTaskAsSuccess.js";

export class CoursePlanWorkerScope {
    private readonly fetchAllLocalCourses: FetchAllLocalCourses;
    private readonly claimCourseIngestionTask: ClaimIngestionTask;
    private readonly createCanvasClient: CreateCanvasClient;
    private readonly markTaskAsSuccess: MarkTaskAsSuccess;
    constructor(
        private readonly courseWorkerDeps: CourseWorkerDeps,
    ) {
        this.claimCourseIngestionTask = new ClaimIngestionTask(this.courseWorkerDeps.ingestionTasks);
        this.fetchAllLocalCourses = new FetchAllLocalCourses(this.courseWorkerDeps.courses);
        this.createCanvasClient = new CreateCanvasClient(this.courseWorkerDeps.ingestionRuns, this.courseWorkerDeps.canvasFactory, this.courseWorkerDeps.clientFactory);
        this.markTaskAsSuccess = new MarkTaskAsSuccess(this.courseWorkerDeps.ingestionTasks);
    };

    async execute() {
        const { ingestionRunId, taskId } = this.courseWorkerDeps.job.data;
        const { courseFullIngest, courseChange, ingestionTasks, courseActivityStream } = this.courseWorkerDeps;

        const task = await this.claimCourseIngestionTask.execute(taskId);

        const canvasCourseId = this.toCourseId(task.entityId);

        const courseExists = await this.courseExistsLocally(task.schoolId, canvasCourseId);
        if (!courseExists) {
            await this.enqueueFullIngestionForNewCourse(ingestionTasks, courseFullIngest, ingestionRunId, canvasCourseId, task.schoolId);
            await this.completeJob(task.taskId, this.courseWorkerDeps.job);
            return;
        }

        const canvasCourseActivityStream = await this.getCourseActivityStream(ingestionRunId, task.schoolId, canvasCourseId);

        const localNewestActivityStreamItemId = await courseActivityStream.findMostRecentStreamItemId(canvasCourseId);

        const newItems = canvasCourseActivityStream.filter(course => course.id > localNewestActivityStreamItemId);
        if (newItems.length === 0) {
            await this.completeJob(taskId, this.courseWorkerDeps.job);
            return;
        };

        await this.enqueueCourseChangeTasks(ingestionTasks, courseChange, ingestionRunId, canvasCourseId, task.schoolId, newItems);
        await this.completeJob(taskId, this.courseWorkerDeps.job);
    }

    private toCourseId(entityId: unknown): number {
        const courseId = Number(entityId);
        assert(Number.isInteger(courseId) && courseId > 0, "Task entity Id must be a positive integer");
        return courseId;
    }

    private async courseExistsLocally(schoolId: number, canvasCourseId: number) {
        const allLocalCourseIds = await this.fetchAllLocalCourses.execute(schoolId);
        const localCourseIdsSet = new Set<number>(allLocalCourseIds);

        return determineCourseExistsInLocalDb(localCourseIdsSet, canvasCourseId);
    }

    private async enqueueFullIngestionForNewCourse(
        ingestionTasks: IIngestionTaskRepository,
        courseFullIngest: Queue,
        ingestionRunId: string,
        canvasCourseId: number,
        schoolId: number,
    ) {
        const newTaskId = await ingestionTasks.insertNewCourseFullIngest(ingestionRunId, canvasCourseId, schoolId);
        await courseFullIngest.add("full_ingest", { ingestionRunId, taskId: newTaskId });
    };

    private async getCourseActivityStream(ingestionRunId: string, schoolId: number, canvasCourseId: number) {
        const canvasClient = await this.createCanvasClient.execute(ingestionRunId, schoolId);
        const canvasCourseActivityStream = await canvasClient.getCanvasCourseActivityStream(canvasCourseId);
        if (!canvasCourseActivityStream) {
            // This means there is no stream so course is brand new, has finished, or nothing has changed in 2 weeks?
            // TODO: this should not be error. need to throw one for now to keep implementing the worker
            throw new Error("no course actvity stream");
        };
        return canvasCourseActivityStream;
    }

    private async enqueueCourseChangeTasks(
        ingestionTasks: IIngestionTaskRepository,
        courseChange: Queue,
        ingestionRunId: string,
        canvasCourseId: number,
        schoolId: number,
        newItems: StreamActivityItem[],
    ) {
        const courseChangeTaskId = await ingestionTasks.insertCourseChangeTasks(ingestionRunId, canvasCourseId, schoolId, newItems);
        // Note: All course change tasks are queued under one task ID
        await courseChange.add("course_change", { ingestionRunId, courseChangeTaskId });
    }

    private async completeJob(taskId: string, job: Job) {
        // Finsh the job and updated the status
        await this.markTaskAsSuccess.execute(taskId);
        await job.updateProgress(100);
    }
}