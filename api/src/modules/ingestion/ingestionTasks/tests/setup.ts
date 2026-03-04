/* eslint-disable unused-imports/no-unused-vars */
import { vi } from "vitest";

import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/ingestionTask.interface.js";

import type { IngestionTask, IngestionTaskKind, IngestionTaskStatus } from "../domain/types.js";

export const repo: IIngestionTaskRepository = {
    claimCourseIngestionTask: vi.fn().mockResolvedValue({
        courseId: 1,
        schoolId: 1,
        taskId: "1",
        kind: "course:Plan",
        entityType: "course",
        entityId: "1",
        status: "running",
    } satisfies IngestionTask),
    insertCoursePlansFromArray(ingestionRunId: string, courseIds: number[], schoolId: number): Promise<string[]> {
        throw new Error("Function not implemented.");
    },
    insertNewCourseFullIngest(ingestionRunId: string, courseId: number, schoolId: number): Promise<string> {
        throw new Error("Function not implemented.");
    },
    insertCourseChangeTasks(ingestionRunId: string, courseId: number, schoolId: number, streamItems: StreamActivityItem[]): Promise<string> {
        throw new Error("Function not implemented.");
    },
    updateTaskStatus(newStatus: IngestionTaskStatus, taskId: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    findCourseIngestionTask(taskId: string): Promise<IngestionTask | undefined> {
        throw new Error("Function not implemented.");
    },
    insertCanvasFetchTaskForFullIngestion(ingestionRunId: string, fetchType: IngestionTaskKind[], courseId: number, schoolId: number): Promise<string[]> {
        throw new Error("Function not implemented.");
    },
};

export const failRepo: IIngestionTaskRepository = {
    claimCourseIngestionTask: vi.fn().mockResolvedValue(null),
    updateTaskStatus: vi.fn(),
    insertCoursePlansFromArray(ingestionRunId: string, courseIds: number[], schoolId: number): Promise<string[]> {
        throw new Error("Function not implemented.");
    },
    insertNewCourseFullIngest(ingestionRunId: string, courseId: number, schoolId: number): Promise<string> {
        throw new Error("Function not implemented.");
    },
    insertCourseChangeTasks(ingestionRunId: string, courseId: number, schoolId: number, streamItems: StreamActivityItem[]): Promise<string> {
        throw new Error("Function not implemented.");
    },
    findCourseIngestionTask(taskId: string): Promise<IngestionTask | undefined> {
        throw new Error("Function not implemented.");
    },
    insertCanvasFetchTaskForFullIngestion(ingestionRunId: string, fetchType: IngestionTaskKind[], courseId: number, schoolId: number): Promise<string[]> {
        throw new Error("Function not implemented.");
    },
};