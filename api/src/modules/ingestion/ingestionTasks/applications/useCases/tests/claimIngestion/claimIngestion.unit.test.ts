import { beforeEach, describe, expect, it } from "vitest";

import { TaskNotClaimable } from "@/modules/ingestion/ingestionTasks/domain/errors/errorsTypes.js";
import { makeMockTask } from "@/modules/tests/mockingFactory.js";

import type { mockClaimIngestionDeps } from "./setup.js";

import { ClaimIngestionTask } from "../../claimIngestion.js";
import { makeMockClaimIngestionDeps } from "./setup.js";

describe("claim ingestion unit tests", () => {
    let claimIngestionDeps: mockClaimIngestionDeps;
    let claimIngestion: ClaimIngestionTask;

    beforeEach(() => {
        claimIngestionDeps = makeMockClaimIngestionDeps();
        claimIngestion = new ClaimIngestionTask(claimIngestionDeps);
    });

    it("should return the task", async () => {
        const task = makeMockTask(12345, 1, "2345", "course:Plan", "course", "12", "queued");
        claimIngestionDeps.claimIngestionTask.mockResolvedValue(task);

        const response = await claimIngestion.execute(task.taskId);
        expect(response).toMatchObject(task);
    });

    it("shoud throw TaskNotClaiamable error", async () => {
        const task = makeMockTask(123, 1, "", "course:Plan", "course", "12345", "queued");
        claimIngestionDeps.claimIngestionTask.mockResolvedValue(task);

        await expect(claimIngestion.execute(task.taskId)).rejects.toThrow(TaskNotClaimable);
    });

    it("should throw a TaskNotClaimable error due to bad status", async () => {
        const task = makeMockTask(123, 1, "12", "course:Plan", "course", "1234", "processed");
        claimIngestionDeps.claimIngestionTask.mockResolvedValue(task);

        await expect(claimIngestion.execute(task.taskId)).rejects.toThrow(TaskNotClaimable);
    });
});