import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import { CoursePlanWorkerScope } from "../CoursePlanWorker.scope.js";
import { getScopeDeps, makeMockJob, makeMockTask, makeMockWorkerDeps } from "./CoursePlanSetup.js";

export type scopeDepsReturnType = ReturnType<typeof getScopeDeps>;

describe("unit tests for CoursePlanWorker", () => {
    let coursePlanWorkerScope: CoursePlanWorkerScope;
    let mockScopeDeps: scopeDepsReturnType;

    beforeEach(() => {
        mockScopeDeps = getScopeDeps();
    });

    afterEach(() => vitest.clearAllMocks());

    it("should enqueue a course full ingest after determining there is no course in the local db", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockWorkerDeps (mockJob, mockScopeDeps);
        const task = makeMockTask(1, 1, String(999), "course:Plan", "course", "1", "running");
        coursePlanWorkerScope = new CoursePlanWorkerScope(mockDeps);

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.courses.findAllCourseIdsForSchool.mockResolvedValueOnce([]);
        mockDeps.ingestionTasks.insertNewCourseFullIngest.mockResolvedValue("1");
        mockDeps.courseFullIngest.add.mockResolvedValueOnce(mockDeps.job);

        await expect(coursePlanWorkerScope.execute()).resolves.toBeUndefined();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.courses.findAllCourseIdsForSchool).toHaveBeenCalledExactlyOnceWith(task.schoolId);
        expect(mockDeps.ingestionTasks.insertNewCourseFullIngest).toHaveBeenCalledExactlyOnceWith(mockDeps.job.data.ingestionRunId, Number(task.entityId), task.schoolId);
        expect(mockDeps.courseFullIngest.add).toHaveBeenCalledExactlyOnceWith("full_ingest", { ingestionRunId: mockDeps.job.data.ingestionRunId, taskId: "1" });

        expect(mockDeps.courseChange.add).not.toBeCalled();
    });

    it("should return undefined after determining that there are no new courses and the stream is up to date", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockWorkerDeps(mockJob, mockScopeDeps);
        const task = makeMockTask(1, 1, String(998), "course:Plan", "course", "998", "queued");
        coursePlanWorkerScope = new CoursePlanWorkerScope(mockDeps);

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.courses.findAllCourseIdsForSchool.mockResolvedValue([998]);
        mockDeps.ingestionRuns.fetchUserIdAndUrl.mockResolvedValue({ userId: "1", canvasBaseUrl: "testUrl" });
        mockDeps.clientFactory.create.mockReturnValue(mockDeps.internalClient);
        mockDeps.internalClient.getUsersCanvasToken.mockResolvedValue("testToken");
        mockDeps.canvasFactory.create.mockReturnValue(mockDeps.canvasClient);
        mockDeps.canvasClient.getCanvasCourseActivityStream.mockResolvedValue([]);

        await expect(coursePlanWorkerScope.execute()).resolves.toBeUndefined();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.courses.findAllCourseIdsForSchool).toHaveBeenCalledExactlyOnceWith(task.schoolId);
        expect(mockDeps.canvasClient.getCanvasCourseActivityStream).toHaveBeenCalledExactlyOnceWith(998);

        expect(mockDeps.courseFullIngest.add).not.toHaveBeenCalled();
        expect(mockDeps.ingestionTasks.insertCanvasFetchTaskForFullIngestion).not.toHaveBeenCalled();
        expect(mockDeps.courseChange.add).not.toHaveBeenCalled();
    });
});