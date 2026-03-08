import { beforeEach, describe, expect, it } from "vitest";

import type { CanvasCourse, CanvasTab } from "@/infrastructure/canvas/types.js";
import type { InsertCourseInfo } from "@/infrastructure/domain/types.js";

import { makeMockJob, makeMockTask } from "@/modules/ingestion/tests/mockingFactory.js";

import type { mockDbWriteDeps } from "./setup.js";

import { DbWriteScope } from "../../dbWriteWorkerScope.js";
import { getMockDbWriteScopeDeps, makeMockDbWriteWorkerDeps } from "./setup.js";

describe("unit tests for the dbWriteScope", () => {
    let mockDbWriteDeps: mockDbWriteDeps;
    let dbWriteScope: DbWriteScope;

    beforeEach(() => {
        mockDbWriteDeps = getMockDbWriteScopeDeps();
    });

    it("should write to the CourseInfo Db an queue process jobs for syllabus and tabs", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockDbWriteWorkerDeps(mockJob, mockDbWriteDeps);
        const task = makeMockTask(2, 1, "task_2", "write:CourseInfo", "rawDoc", "doc_1", "queued");
        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.canvasRawDocuments.fetchRawDocument.mockResolvedValue({
            id: "doc_1",
            entityType: "rawDoc",
            entityId: String(2),
            payload: JSON.stringify({
                id: 1,
                name: "course1",
                course_code: "courseCode",
                syllabus_body: "<p> this is the syllabus</p>",
                workflow_state: "active",
                tabs: [{
                    id: "modules",
                    html_url: "/url",
                    normalizedUrl: "/url",
                    canvasInfoId: "1",
                }] satisfies CanvasTab[],
            } satisfies CanvasCourse),
            schoolId: task.schoolId,
            courseId: task.courseId,
        });
        mockDeps.courseInfo.insertCourseInfo.mockResolvedValue({
            courseInfoId: "1",
            syllabusId: "syb1",
        } satisfies InsertCourseInfo);

        dbWriteScope = new DbWriteScope(mockDeps);
        await dbWriteScope.execute();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.canvasRawDocuments.fetchRawDocument).toHaveBeenCalledExactlyOnceWith(task.entityId);
        expect(mockDeps.courseInfo.insertCourseInfo).toHaveBeenCalledExactlyOnceWith("courseCode", "course1", 2, "<p> this is the syllabus</p>", [{
            id: "modules",
            html_url: "/url",
            normalizedUrl: "/url",
            canvasInfoId: "1",
        }]);
        expect(mockDeps.processQueue.add).toHaveBeenCalledTimes(2);
        expect(mockDeps.ingestionTasks.updateTaskStatus).toHaveBeenCalledExactlyOnceWith("success", mockJob.data.taskId);
    });
});