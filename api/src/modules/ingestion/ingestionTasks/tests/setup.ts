import { vi } from "vitest";

import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";

import type { IngestionTask } from "../domain/types.js";

export const repo: IIngestionTaskRepository = {
    claimIngestionTask: vi.fn().mockResolvedValue({
        courseId: 1,
        schoolId: 1,
        taskId: "1",
        kind: "course:Plan",
        entityType: "course",
        entityId: "1",
        status: "running",
    } satisfies IngestionTask),
    insertCoursePlansFromArray: vi.fn(),
    insertNewCourseFullIngest: vi.fn(),
    insertCourseChangeTasks: vi.fn(),
    updateTaskStatus: vi.fn(),
    findCourseIngestionTask: vi.fn(),
    insertCanvasFetchTaskForFullIngestion: vi.fn(),
};

export const failRepo: IIngestionTaskRepository = {
    claimIngestionTask: vi.fn().mockResolvedValue(null),
    updateTaskStatus: vi.fn(),
    insertCoursePlansFromArray: vi.fn(),
    insertNewCourseFullIngest: vi.fn(),
    insertCourseChangeTasks: vi.fn(),
    findCourseIngestionTask: vi.fn(),
    insertCanvasFetchTaskForFullIngestion: vi.fn(),
};