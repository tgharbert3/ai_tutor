import type { Job } from "bullmq";

import { beforeEach, describe, expect, it } from "vitest";

import type { MockCheckRunDeps } from "./setup.js";

import { CheckRunCompletion } from "../../checkRunCompletionScope.js";
import { getMockCheckRunDeps, makeMockCheckRunScopeDeps } from "./setup.js";

describe("should update the ingestion run when all the tasks are successful", () => {
    let mockCheckRunDeps: MockCheckRunDeps;

    beforeEach(() => {
        mockCheckRunDeps = getMockCheckRunDeps();
    });

    it("should update the ingestion run when all the tasks are successful", async () => {
        const mockJob = { id: "job_1", data: { ingestionRunId: "run_1" } } as unknown as Job;
        const mockDeps = makeMockCheckRunScopeDeps(mockJob, mockCheckRunDeps);
        const checkRun = new CheckRunCompletion(mockDeps);
        mockDeps.ingestionTasks.getRunCounts.mockResolvedValue({
            queuedCount: 0,
            runningCount: 0,
            successCount: 2,
            failedCount: 0,
        });

        await expect(checkRun.execute()).resolves.toBeUndefined();

        expect(mockDeps.ingestionTasks.getRunCounts).toHaveBeenCalledExactlyOnceWith(mockJob.data.ingestionRunId);
        expect(mockDeps.ingestionRuns.updateRunStatus).toHaveBeenCalledExactlyOnceWith("complete", mockJob.data.ingestionRunId);
    });
});