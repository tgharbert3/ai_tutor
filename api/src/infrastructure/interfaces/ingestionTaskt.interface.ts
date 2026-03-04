import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";

import type { IngestionTask, IngestionTaskKind, IngestionTaskStatus } from "../../../modules/ingestion/ingestionTasks/domain/types.js";

export interface IIngestionTask {

    insertCoursePlansFromArray: (ingestionRunId: string, courseIds: number[], schoolId: number) => Promise<string[]>;
    insertNewCourseFullIngest: (ingestionRunId: string, courseId: number, schoolId: number) => Promise<string>;
    /**
     * Function to insert a new ingestion Task and Course stream activity items. Uses transaction to make sure both succed or fail
     * @param ingestionRunId
     * @param courseId
     * @param schoolId
     * @param streamItems
     * @returns new Task Id
     */
    insertCourseChangeTasks: (ingestionRunId: string, courseId: number, schoolId: number, streamItems: StreamActivityItem[]) => Promise<string>;
    updateTaskStatus: (newStatus: IngestionTaskStatus, taskId: string) => Promise<void>;
    findCourseIngestionTask: (taskId: string) => Promise<IngestionTask | undefined>;
    /**
     * Finds the task in the DB and updates the status to running
     * @param taskId
     * @returns The full task or undefined if DNE
     */
    claimCourseIngestionTask: (taskId: string) => Promise<IngestionTask>;

    insertCanvasFetchTaskForFullIngestion: (ingestionRunId: string, fetchType: IngestionTaskKind[], courseId: number, schoolId: number) => Promise<string[]>;
}