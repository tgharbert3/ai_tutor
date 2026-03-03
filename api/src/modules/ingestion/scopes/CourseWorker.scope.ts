import { FetchUsersCanvasTokenUseCase } from "@/infrastructure/internal/application/fetchUsersCanvasToken.useCase.js";

import type { CourseWorkerDeps } from "../domain/types.js";

import { courseExistsInLocalDb } from "../../courses/application/diffCourses.js";
import { FetchAllLocalCoursesUseCase } from "../../courses/application/fetchLocalCourses.useCase.js";

export class CoursePlanWorkerScope {
    private readonly fetchAllLocalCoursesUC: FetchAllLocalCoursesUseCase;
    private readonly fetchUsersCanvasUC: FetchUsersCanvasTokenUseCase;
    constructor(
        private readonly courseWorkerDeps: CourseWorkerDeps,
    ) {
        this.fetchAllLocalCoursesUC = new FetchAllLocalCoursesUseCase(this.courseWorkerDeps.repos.courses);
        this.fetchUsersCanvasUC = new FetchUsersCanvasTokenUseCase(this.courseWorkerDeps.clientFactory);
    };

    // TODO: Possibly wrap in try catch or result pattern to be able to update to failed if the job fails
    async execute() {
        const { ingestionRunId, taskId } = this.courseWorkerDeps.job.data;
        // Claim the task so it cannot be picked up by another worker
        const task = await this.courseWorkerDeps.repos.ingestionTasks.claimCourseIngestionTask(taskId);
        if (!task) {
            throw new Error("No task for task Id");
        }
        // Canvas Course Id
        const courseId = Number(task.entityId);

        // All the course Ids in the local db for the school id
        const localCourseIds = await this.fetchAllLocalCoursesUC.execute(task.schoolId);
        // Cast to a set for faster lookups
        const localCourseIdsSet = new Set<number>(localCourseIds);

        // Check to see if the course exists in our local db
        const courseExists = courseExistsInLocalDb(localCourseIdsSet, courseId);
        if (!courseExists) {
            const newTaskId = await this.courseWorkerDeps.repos.ingestionTasks.insertNewCourseFullIngest(ingestionRunId, courseId, task.schoolId);
            await this.courseWorkerDeps.queues.courseFullIngest.add("full_ingest", { ingestionRunId, newTaskId });
            // Finshed the job and updated the status
            await this.courseWorkerDeps.repos.ingestionTasks.updateTaskStatus("success", taskId);
            await this.courseWorkerDeps.job.updateProgress(100);
        };

        const canvasClientDeps = await this.courseWorkerDeps.repos.ingestionRuns.fetchUserIdAndUrl(ingestionRunId, Number(taskId));
        const canvasToken = await this.fetchUsersCanvasUC.execute(canvasClientDeps.userId);
        const canvasClient = this.courseWorkerDeps.canvasFactory.create({ apiToken: canvasToken, canvasBaseUrl: canvasClientDeps.canvasBaseUrl });
        const courseActivityStream = await canvasClient.getCanvasCourseActivityStream(courseId);
        if (!courseActivityStream) {
            // This means there is no stream so course is brand new, has finished, or nothing has changed in 2 weeks?
            // TODO: this should not be error. need to throw one for now to keep implementing the worker
            throw new Error("no course actvity stream");
        };
        // Get the newest canvas stream id from our local db for specific course
        const localNewestActivityStreamItemId = await this.courseWorkerDeps.repos.courseActivityStream.findMostRecentStreamItemId(courseId);
        const newItems = courseActivityStream.filter(course => course.id > localNewestActivityStreamItemId);
        if (newItems.length === 0) {
            // If there are no new Ids then nothing has changed
            await this.courseWorkerDeps.repos.ingestionTasks.updateTaskStatus("success", taskId);
            await this.courseWorkerDeps.job.updateProgress(100);
            // TODO: Need a way to return and complete the sync
        };
        const courseChangeTaskId = await this.courseWorkerDeps.repos.ingestionTasks.insertCourseChangeTasks(ingestionRunId, courseId, task.schoolId, newItems);
        // Note: All course change tasks are queued under one task ID
        await this.courseWorkerDeps.queues.courseChange.add("course_change", { ingestionRunId, courseChangeTaskId });

        // Update the status and finish the job
        await this.courseWorkerDeps.repos.ingestionTasks.updateTaskStatus("success", taskId);
        await this.courseWorkerDeps.job.updateProgress(100);
    }
}