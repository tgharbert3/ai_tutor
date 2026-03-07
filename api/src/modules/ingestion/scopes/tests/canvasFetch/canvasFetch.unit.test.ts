import { afterEach, beforeEach, describe, expect, it, vi, vitest } from "vitest";

import type { CanvasCourse, CanvasTab } from "@/infrastructure/canvas/types.js";

import { makeMockJob, makeMockTask } from "@/modules/ingestion/tests/mockingFactory.js";

import type { MockCanvasFetchdeps } from "./setup.js";

import { CanvasFetchWorkerScope } from "../../canvasFetchWorkerScope.js";
import { getMockCanvasFetchScopeDeps, makeMockCanvasFetchDeps } from "./setup.js";

describe("unit tests for canvasfetch Worker", () => {
    let canvasFetchDeps: MockCanvasFetchdeps;
    let canvasFetch: CanvasFetchWorkerScope;

    beforeEach(() => {
        canvasFetchDeps = getMockCanvasFetchScopeDeps();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-03-06T12:00:00.000Z"));
    });

    afterEach(() => {
        vitest.clearAllMocks();
        vi.useRealTimers();
    });

    it("should add job to dbWrite queue after fetching from canvas", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockCanvasFetchDeps(mockJob, canvasFetchDeps);
        canvasFetch = new CanvasFetchWorkerScope(mockDeps);
        const task = makeMockTask(2, 1, "12345", "fetchCourseInfo", "syllabus", "2", "queued");

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.ingestionRun.fetchUserIdAndUrl.mockResolvedValue({ userId: "1", canvasBaseUrl: "testUrl" });
        mockDeps.clientFactory.create.mockReturnValue(mockDeps.internalClient);
        mockDeps.internalClient.getUsersCanvasToken.mockResolvedValue("testToken");
        mockDeps.canvasFactory.create.mockReturnValue(mockDeps.canvasClient);
        mockDeps.canvasClient.getCourseInfo.mockResolvedValue({
            id: 0,
            name: "courseTest",
            course_code: "CT",
            syllabus_body: "<p>this is the syllabus</p>",
            workflow_state: "available",
            tabs: [{
                id: "modules",
                html_url: "/url",
                normalizedUrl: "/url",
                canvasInfoId: "1",
            }] satisfies CanvasTab[],
        } satisfies CanvasCourse);
        mockDeps.canvasRawDocuments.insertCanvasRawDocument.mockResolvedValue("doc_id");
        mockDeps.ingestionTasks.insertDbWriteTask.mockResolvedValue("writeTaskId");

        await canvasFetch.execute();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.ingestionRun.fetchUserIdAndUrl).toHaveBeenCalledExactlyOnceWith(mockJob.data.ingestionRunId, task.schoolId);
        expect(mockDeps.internalClient.getUsersCanvasToken).toHaveBeenCalledOnce();
        expect(mockDeps.canvasClient.getCourseInfo).toHaveBeenCalledExactlyOnceWith(task.courseId);
        expect(mockDeps.canvasRawDocuments.insertCanvasRawDocument).toHaveBeenCalledExactlyOnceWith(
            "course",
            String(task.courseId),
            JSON.stringify({
                id: 0,
                name: "courseTest",
                course_code: "CT",
                syllabus_body: "<p>this is the syllabus</p>",
                workflow_state: "available",
                tabs: [{
                    id: "modules",
                    html_url: "/url",
                    normalizedUrl: "/url",
                    canvasInfoId: "1",
                }],
            }),
            expect.any(Date),
            task.courseId,
            task.schoolId,
        );
        expect(mockDeps.ingestionTasks.insertDbWriteTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.ingestionRunId, "write:Course", task.courseId, task.schoolId, "doc_id", "course");
        expect(mockDeps.dbWrite.add).toHaveBeenCalledExactlyOnceWith("write", { ingestionRunId: mockJob.data.ingestionRunId, taskId: "writeTaskId" });
        expect(mockDeps.job.updateProgress).toHaveBeenCalledOnce();
        expect(mockDeps.ingestionTasks.updateTaskStatus).toHaveBeenCalledOnce();
    });
});