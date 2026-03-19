import { beforeEach, describe, expect, it } from "vitest";

import env from "@/env.js";
import { CanvasClientFactory } from "@/infrastructure/canvas/canvas-client.js";
import { getQueueOptions } from "@/infrastructure/config/queueOptions.js";
import { getTestDb } from "@/infrastructure/db/testDb.js";
import { SanitizeHtml } from "@/infrastructure/sanitizeHtml/sanitizeHtml.js";

import { makeMockClient, makeMockClientFactory } from "../../tests/mockingFactory.js";

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

    it("should return complete for the run status", async () => {
        const jweData = {
            userId: crypto.randomUUID(),
            email: "tgh1432@uncw.edu",
            canvasBaseUrl: "https://uncw.instructure.com",
            canvasToken: env.API_TOKEN,
        };
        const pre = appContainer.createPreIngestionScope(jweData);
        const { ingestionId } = await pre.execute();
        await waitForRunToFinish(10000);

        const ingestionRunStatus = await appContainer.repos.ingestionRuns.getRunStatus(ingestionId);
        const userEnrollments = await appContainer.repos.enrollments.findAllActiveEnrollmentIds(jweData.userId);
        const courseIds = await appContainer.repos.courses.findAllCourseIdsForSchool(1);
        const courseInfo = await appContainer.repos.courseInfo.getAllCourseInfo(courseIds[1]);

        expect(ingestionRunStatus).toBe("complete");
        expect(userEnrollments).toBeInstanceOf(Array);
        expect(userEnrollments.length).toBeGreaterThan(0);
        expect(courseIds).toBeInstanceOf(Array);
        expect(courseIds.length).toBeGreaterThan(0);
        expect(courseInfo.course_info).not.toBeNull();
        expect(courseInfo.course_syllabus).not.toBeNull();
        expect(courseInfo.course_tabs).not.toBeNull();
    });
});

async function waitForRunToFinish(
    timeoutMs = 5000,
) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        await new Promise(resolve => setTimeout(resolve, 25));
    };
}