import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";

import { makeMockJob, makeMockTask } from "../../../tests/mockingFactory.js";
import { CoursePlanWorkerScope } from "../../CoursePlanWorker.scope.js";
import { getScopeDeps, makeMockWorkerDeps } from "./CoursePlanSetup.js";

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
        const task = makeMockTask(1, 1, String(999), "course:Plan", "course", "1", "queued");
        coursePlanWorkerScope = new CoursePlanWorkerScope(mockDeps);

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.courses.findAllCourseIdsForSchool.mockResolvedValueOnce([]);
        mockDeps.ingestionTasks.insertNewCourseFullIngest.mockResolvedValue("1");
        mockDeps.courseFullIngest.add.mockResolvedValueOnce(mockDeps.job);

        await coursePlanWorkerScope.execute();

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

        await coursePlanWorkerScope.execute();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.courses.findAllCourseIdsForSchool).toHaveBeenCalledExactlyOnceWith(task.schoolId);
        expect(mockDeps.canvasClient.getCanvasCourseActivityStream).toHaveBeenCalledExactlyOnceWith(998);

        expect(mockDeps.courseFullIngest.add).not.toHaveBeenCalled();
        expect(mockDeps.courseChange.add).not.toHaveBeenCalled();
    });

    it("should enqueue course change tasks after determining a new stream item", async () => {
        const mockJob = makeMockJob("job_2", { ingestionRunId: "run_2", taskId: "task_2" });
        const mockDeps = makeMockWorkerDeps(mockJob, mockScopeDeps);
        const task = makeMockTask(1, 1, "task_2", "course:Plan", "course", "12345", "queued");
        const newStreamItem = { id: 10, courseId: 12345, entityType: "Message", htmlUrl: "testUrl2", updated_at: new Date() } satisfies StreamActivityItem;
        coursePlanWorkerScope = new CoursePlanWorkerScope(mockDeps);

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.courses.findAllCourseIdsForSchool.mockResolvedValue([12345]);
        mockDeps.ingestionRuns.fetchUserIdAndUrl.mockResolvedValue({ userId: "1", canvasBaseUrl: "testUrl" });
        mockDeps.clientFactory.create.mockReturnValue(mockDeps.internalClient);
        mockDeps.internalClient.getUsersCanvasToken.mockResolvedValue("testToken2");
        mockDeps.canvasFactory.create.mockReturnValue(mockDeps.canvasClient);
        mockDeps.courseActivityStream.findMostRecentStreamItemId.mockResolvedValue(1);
        mockDeps.canvasClient.getCanvasCourseActivityStream.mockResolvedValue([newStreamItem]);
        mockDeps.ingestionTasks.insertCourseChangeTasks.mockResolvedValue("3");

        await coursePlanWorkerScope.execute();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.courses.findAllCourseIdsForSchool).toHaveBeenCalledExactlyOnceWith(task.schoolId);
        expect(mockDeps.canvasClient.getCanvasCourseActivityStream).toHaveBeenCalledExactlyOnceWith(12345);
        expect(mockDeps.courseChange.add).toHaveBeenCalledOnce();

        expect(mockDeps.courseFullIngest.add).not.toHaveBeenCalledExactlyOnceWith("course_change", { ingestionRunId: mockDeps.job.data.ingestionRunId, taskId: "3" });
    });
});