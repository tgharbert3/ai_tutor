import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import type { CanvasCourse, CanvasTab } from "@/infrastructure/canvas/types.js";
import type { InsertCourseInfo } from "@/infrastructure/domain/types.js";
import type { SanitizedSyllabus } from "@/modules/ingestion/ingestionTasks/domain/types.js";

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

    afterEach(() => {
        vitest.clearAllMocks();
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
        await expect(dbWriteScope.execute()).resolves.toBeUndefined();

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
        expect(mockDeps.job.updateProgress).toHaveBeenCalledExactlyOnceWith(100);
    });

    it("should write the syllabus information to the syllabus table", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockDbWriteWorkerDeps(mockJob, mockDbWriteDeps);
        const task = makeMockTask(2, 1, "task_1", "write:Syllabus", "rawDoc", "doc_1", "queued");

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.canvasRawDocuments.fetchRawDocument.mockResolvedValue({
            id: "doc_1",
            entityType: "rawDoc",
            entityId: String(2),
            payload: JSON.stringify({
                syllabusId: "syllabus1",
                sanitizedSyllabus: "<p>this is a p tag</p>",
                plainText: "this is a p tag",
                syllabusHash: "hashed",
            } satisfies SanitizedSyllabus),
            schoolId: task.schoolId,
            courseId: task.courseId,
        });

        dbWriteScope = new DbWriteScope(mockDeps);
        await expect(dbWriteScope.execute()).resolves.toBeUndefined();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.canvasRawDocuments.fetchRawDocument).toHaveBeenCalledExactlyOnceWith(task.entityId);
        expect(mockDeps.courseInfo.insertSyllabus).toHaveBeenCalledExactlyOnceWith("syllabus1", "<p>this is a p tag</p>", "this is a p tag", "hashed");
        expect(mockDeps.ingestionTasks.updateTaskStatus).toHaveBeenCalledExactlyOnceWith("success", mockJob.data.taskId);
        expect(mockDeps.job.updateProgress).toHaveBeenCalledExactlyOnceWith(100);
    });
});