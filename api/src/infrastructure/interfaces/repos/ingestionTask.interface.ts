import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";
import type { IngestionTask, IngestionTaskET, IngestionTaskKind, IngestionTaskStatus } from "@/modules/ingestion/ingestionTasks/domain/types.js";

export interface IIngestionTaskRepository {

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
    claimIngestionTask: (taskId: string) => Promise<IngestionTask>;

    insertCanvasFetchTaskForFullIngestion: (ingestionRunId: string, fetchType: IngestionTaskKind[], courseId: number, schoolId: number) => Promise<string[]>;
    insertDbWriteTask: (ingestionRunId: string, taskKind: IngestionTaskKind, courseId: number, schoolId: number, docId: string, entityType: IngestionTaskET) => Promise<string>;
    insertProcessSyllabusTask: (ingestionRunId: string, taskKind: IngestionTaskKind, courseId: number, schoolId: number, entityType: IngestionTaskET, syllabusId: string) => Promise<string>;
    insertWriteSyllabusTask: (ingestionRunId: string, kind: IngestionTaskKind, courseId: number, schoolId: number, entityType: IngestionTaskET, syllabusId: string) => Promise<string>;
}