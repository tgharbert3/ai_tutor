import type { Job, Queue } from "bullmq";
import type { Mocked } from "vitest";

import { vi } from "vitest";

import type { CanvasApiPort, CanvasApiPortFactory } from "@/infrastructure/canvas/ports/canvas.api.port.js";
import type { ICanvasRawDocumentsRepository } from "@/infrastructure/interfaces/repos/canvasRawDocuments.interface.js";
import type { ICourseActivityStreamRepository } from "@/infrastructure/interfaces/repos/courseActivityStream.interface.js";
import type { ICourseInfoRepository } from "@/infrastructure/interfaces/repos/courseInfo.interface.js";
import type { ICoursesRepository } from "@/infrastructure/interfaces/repos/courses.repo.interface.js";
import type { IIngestionRunRepository } from "@/infrastructure/interfaces/repos/ingestionRun.interface.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";
import type { ISanitizeHtml } from "@/infrastructure/interfaces/sanitizeHtml/sanitizeHtml.interface.js";
import type { ClientApiPort, ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";

import type { IngestionTask, IngestionTaskET, IngestionTaskKind, IngestionTaskStatus } from "../ingestionTasks/domain/types.js";

export function makeMockIngestionTaskRepo(): Mocked<IIngestionTaskRepository> {
    return {
        insertNewCourseFullIngest: vi.fn(),
        insertCoursePlansFromArray: vi.fn(),
        insertCourseChangeTasks: vi.fn(),
        updateTaskStatus: vi.fn(),
        findCourseIngestionTask: vi.fn(),
        claimIngestionTask: vi.fn(),
        insertCanvasFetchTaskForFullIngestion: vi.fn(),
        insertDbWriteTask: vi.fn(),
        insertProcessCourseTabsTask: vi.fn(),
        insertProcessSyllabusTask: vi.fn(),
        insertWriteSyllabusTask: vi.fn(),
    };
};

export function makeMockIngestionRunsRepo(): Mocked<IIngestionRunRepository> {
    return {
        create: vi.fn(),
        updateRunStatus: vi.fn(),
        fetchUserId: vi.fn(),
        fetchCanvasBaseUrl: vi.fn(),
        fetchUserIdAndUrl: vi.fn(),
    };
};

export function makeMockCoursesRepo(): Mocked<ICoursesRepository> {
    return {
        findAllCourseIdsForSchool: vi.fn(),
    };
};

export function makeMockCourseActivityStreamRepo(): Mocked<ICourseActivityStreamRepository> {
    return {
        findMostRecentStreamItemId: vi.fn(),
    };
};

export function makeMockCanvasRawDocumentsRepo(): Mocked<ICanvasRawDocumentsRepository> {
    return {
        insertCanvasRawDocument: vi.fn(),
        fetchRawDocument: vi.fn(),
    };
};

export function makeMockCourseInfo(): Mocked<ICourseInfoRepository> {
    return {
        insertCourseInfo: vi.fn(),
        fetchRawSyllabus: vi.fn(),
    };
}

export function makeMockSanitizeHtml(): Mocked<ISanitizeHtml> {
    return {
        sanitize: vi.fn(),
        convertToPlainText: vi.fn(),
    };
}

export function makeMockCourseFullIngestQueue(): Mocked<Queue> {
    return {
        add: vi.fn(),
    } as unknown as Mocked<Queue>;
};

export function makeMockCourseChangeQueue(): Mocked<Queue> {
    return {
        add: vi.fn(),
    } as unknown as Mocked<Queue>;
};

export function makeMockCanvasFetchQueue(): Mocked<Queue> {
    return {
        add: vi.fn(),
    } as unknown as Mocked<Queue>;
}

export function makeMockProcessQueue(): Mocked<Queue> {
    return {
        add: vi.fn(),
    } as unknown as Mocked<Queue>;
}

export function makeMockDbWriteQueue(): Mocked<Queue> {
    return {
        add: vi.fn(),
    } as unknown as Mocked<Queue>;
}

export function makeMockCanvasFactory(): Mocked<CanvasApiPortFactory> {
    return {
        create: vi.fn(),
    };
};

export function makeMockClientFactory(): Mocked<ClientApiPortFactory> {
    return {
        create: vi.fn(),
    };
};

export function makeMockClient(): Mocked<ClientApiPort> {
    return {
        getUsersCanvasToken: vi.fn(),
    };
}

export function makeMockCanvasClient(): Mocked<CanvasApiPort> {
    return {
        getPrimaryColor: vi.fn(),
        getCanvasCourseActivityStream: vi.fn(),
        getCanvasEnrollments: vi.fn(),
        getCourseInfo: vi.fn(),
    };
}

export function makeMockJob(jobId: string, data: { ingestionRunId: string; taskId: string; docId?: string }) {
    return {
        id: jobId,
        data,
        updateProgress: vi.fn(),
    } as unknown as Job;
}

export function makeMockTask(
    courseId: number,
    schoolId: number,
    taskId: string,
    kind: IngestionTaskKind,
    entityType: IngestionTaskET,
    entityId: string,
    status: IngestionTaskStatus,
) {
    return {
        courseId,
        schoolId,
        taskId,
        kind,
        entityType,
        entityId,
        status,
    } satisfies IngestionTask;
}