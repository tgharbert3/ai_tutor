import { beforeEach, describe, expect, it } from "vitest";

import { makeMockJob, makeMockTask } from "@/modules/ingestion/tests/mockingFactory.js";

import type { scopeDeps } from "./setup.js";

import { FullIngestionScope } from "../../FullIngestionScope.js";
import { getScopeDeps, makeMockWorkerDeps } from "./setup.js";

describe("unit test for full ingestion", () => {
    let scopeDeps: scopeDeps;
    let fullIngestionScope: FullIngestionScope;

    beforeEach(() => {
        scopeDeps = getScopeDeps();
    });

    it("tests adding tasks to the fetch queue", async () => {
        const mockJob = makeMockJob("123-45", { ingestionRunId: "run_1", taskId: "task_1" });
        const mockDeps = makeMockWorkerDeps(mockJob, scopeDeps);
        fullIngestionScope = new FullIngestionScope(mockDeps);
        const task = makeMockTask(1234, 1, "1234", "course:FullIngest", "course", "1234", "queued");
        const syllabusTask = makeMockTask(1234, 1, "12345", "fetch:CourseInfo", "syllabus", "1234", "queued");
        const assignmentsTask = makeMockTask(1234, 1, "123456", "fetch:AllAssignments", "assignment", "1", "queued");

        mockDeps.ingestionTaskRepo.claimIngestionTask.mockResolvedValue(task);
        mockDeps.ingestionTaskRepo.insertCanvasFetchTaskForFullIngestion.mockResolvedValue([syllabusTask.taskId, assignmentsTask.taskId]);

        await fullIngestionScope.execute();

        expect(mockDeps.ingestionTaskRepo.claimIngestionTask).toHaveBeenCalledExactlyOnceWith(mockJob.data.taskId);
        expect(mockDeps.fetchQueue.add).toHaveBeenCalledWith("fetch", { ingestionRunId: "run_1", taskId: syllabusTask.taskId });
        expect(mockDeps.fetchQueue.add).toHaveBeenCalledWith("fetch", { ingestionRunId: "run_1", taskId: assignmentsTask.taskId });
        expect(mockDeps.ingestionTaskRepo.updateTaskStatus).toHaveBeenCalledExactlyOnceWith("success", mockJob.data.taskId);
        expect(mockDeps.job.updateProgress).toHaveBeenCalledWith(100);
    });
});