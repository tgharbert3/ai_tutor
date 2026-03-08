import { beforeEach, describe, expect, it } from "vitest";

import { makeMockJob, makeMockTask } from "@/modules/ingestion/tests/mockingFactory.js";

import type { MockProcessWorkerScopeDeps } from "./setup.js";

import { ProcessWorkerScope } from "../../processWorkerScope.js";
import { getMockProcessWorkerScopeDeps, makeMockProcessWorkerDeps } from "./setup.js";

describe("unit tests for the proccess worker", () => {
    let processWorker: ProcessWorkerScope;
    let scopeDeps: MockProcessWorkerScopeDeps;

    beforeEach(() => {
        scopeDeps = getMockProcessWorkerScopeDeps();
    });

    it("should santize/clean/hash the syallbus and then enqueue a db write job", async () => {
        const mockJob = makeMockJob("job_1", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockProcessWorkerDeps(mockJob, scopeDeps);
        const task = makeMockTask(2, 1, "task_1", "process:Syllabus", "syllabus", "syallabus_1", "queued");

        mockDeps.ingestionTasks.claimIngestionTask.mockResolvedValue(task);
        mockDeps.courseInfo.fetchRawSyllabus.mockResolvedValue("<script>this is a script tag</script><p>this is a p tag</p>");
        mockDeps.sanitizeHtml.sanitize.mockReturnValue("<p>this is a p tag</p>");
        mockDeps.sanitizeHtml.convertToPlainText.mockReturnValue("this is a p tag");
        mockDeps.canvasRawDoc.insertCanvasRawDocument.mockResolvedValue("doc_1");
        mockDeps.ingestionTasks.insertWriteSyllabusTask.mockResolvedValue("writeTask");

        processWorker = new ProcessWorkerScope(mockDeps);
        await processWorker.execute();

        expect(mockDeps.ingestionTasks.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.courseInfo.fetchRawSyllabus).toHaveBeenCalledExactlyOnceWith(task.entityId);
        expect(mockDeps.sanitizeHtml.sanitize).toHaveBeenCalledExactlyOnceWith("<script>this is a script tag</script><p>this is a p tag</p>");
        expect(mockDeps.sanitizeHtml.convertToPlainText).toHaveBeenCalledExactlyOnceWith("<script>this is a script tag</script><p>this is a p tag</p>");
        expect(mockDeps.canvasRawDoc.insertCanvasRawDocument).toHaveBeenCalledExactlyOnceWith(
            "syllabus",
            String(task.courseId),
            JSON.stringify({
                syllabusId: task.entityId,
                sanitizedSyllabus: "<p>this is a p tag</p>",
                plainText: "this is a p tag",
                syllabusHash: Bun.hash("<script>this is a script tag</script><p>this is a p tag</p>").toString(),
            }),
            expect.any(Date),
            task.courseId,
            task.schoolId,
        );
        expect(mockDeps.ingestionTasks.insertWriteSyllabusTask).toHaveBeenCalledExactlyOnceWith(
            mockJob.data.ingestionRunId,
            "write:Syllabus",
            task.courseId,
            task.schoolId,
            "rawDoc",
            "doc_1",
        );
        expect(mockDeps.ingestionTasks.updateTaskStatus).toHaveBeenCalledExactlyOnceWith("success", task.taskId);
    });
});