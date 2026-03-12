import { beforeEach, describe, it } from "vitest";

import { AppContainer } from "@/app/composition/app.composititon.js";
import env from "@/env.js";
import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { getQueueOptions } from "@/infrastructure/config/queueOptions.js";
import { getTestDb } from "@/infrastructure/db/testDb.js";
import { SanitizeHtml } from "@/infrastructure/sanitizeHtml/sanitizeHtml.js";

import { makeMockClient, makeMockClientFactory } from "./mockingFactory.js";

describe("integration tests for ingestion", () => {
    let appContainer: AppContainer;
    let testDb: any;
    beforeEach(async () => {
        testDb = await getTestDb();
        const mockClient = makeMockClient();
        const mockClientFactory = makeMockClientFactory();
        appContainer = new AppContainer(testDb, getQueueOptions(), {
            clientFactory: mockClientFactory,
            canvasFactory: new CanvasClientFactory(),
            sanitizeHtml: new SanitizeHtml(),
        });
        mockClientFactory.create.mockReturnValue(mockClient);
        mockClient.getUsersCanvasToken.mockResolvedValue(env.API_TOKEN);
        appContainer.startWorkers();
    });

    it("test", async () => {
        const jweData = {
            userId: crypto.randomUUID(),
            email: "tgh1432@unce.edu",
            canvasBaseUrl: "https://uncw.instructure.com",
            canvasToken: env.API_TOKEN,
        };
        const pre = appContainer.createPreIngestionScope(jweData);
        const { ingestionId } = await pre.execute();
        await waitForRunToFinish(testDb, ingestionId, 15000);
    });
});

async function waitForRunToFinish(
    db: any,
    runId: string,
    timeoutMs = 5000,
) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        // const run = await db.query.ingestionRuns.findFirst({
        //     where: (ingestionRunsRepo, { eq }) => eq(ingestionRunsRepo.id, runId),
        // });

        // if (!run) {
        //     throw new Error(`Run ${runId} not found`);
        // }

        // if (run.status === "completed")
        //     return run;
        // if (run.status === "failed") {
        //     throw new Error(`Run ${runId} failed: ${run.error ?? "unknown error"}`);
        // }

        await new Promise(resolve => setTimeout(resolve, 25));
    }

// throw new Error(`Timed out waiting for run ${runId} to complete`);
}