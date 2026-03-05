import { afterEach, beforeEach, describe, expect, it, vitest } from "vitest";

import { ClaimIngestionTask } from "../applications/useCases/claimIngestion.js";
import { TaskNotClaimable } from "../domain/errors/errorsTypes.js";
import { failRepo, repo } from "./setup.js";

describe("unit tests for ingestion tasks", () => {
    let useCase: ClaimIngestionTask;
    let failCase: ClaimIngestionTask;

    beforeEach(() => {
        useCase = new ClaimIngestionTask(repo);
        failCase = new ClaimIngestionTask(failRepo);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    it ("should return task when succeeds", async () => {
        const result = await useCase.execute("1");

        expect(result.taskId).toBe("1");
        expect(repo.claimIngestionTask).toHaveBeenCalledTimes(1);
    });

    it("should throw a TaskNotClaimable error", async () => {
        await expect(failCase.execute("1")).rejects.toBeInstanceOf(TaskNotClaimable);
    });
});