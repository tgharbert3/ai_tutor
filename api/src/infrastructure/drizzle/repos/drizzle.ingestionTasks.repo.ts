import { and, eq } from "drizzle-orm";

import type { StreamActivityItem } from "@/infrastructure/canvas/types.js";
import type { insertCourseActivityStream, insertIngestonTask } from "@/infrastructure/db/schema.js";
import type { IIngestionTaskRepository } from "@/infrastructure/interfaces/repos/ingestionTask.interface.js";
import type { db } from "@/lib/types.js";

import { courseActivityStream, ingestionTasks } from "@/infrastructure/db/schema.js";

import type { Counts, IngestionTask, IngestionTaskET, IngestionTaskKind, IngestionTaskStatus } from "../../../modules/ingestion/ingestionTasks/domain/types.js";

export class DrizzleIngestionTasksRepo implements IIngestionTaskRepository {
    constructor(
        private db: db,
    ) {};

    async insertCoursePlansFromArray(ingestionRunId: string, courseIds: number[], schoolId: number): Promise<string[]> {
        const rows = courseIds.map(courseId => ({
            ingestionRunId,
            kind: "course:Plan",
            entityType: "course",
            entityId: String(courseId),
            status: "queued",
            schoolId,
            courseId,
        } satisfies insertIngestonTask));

        const tasks = await this.db.insert(ingestionTasks).values(rows).onConflictDoNothing().returning();
        return tasks.map(task => task.taskId);
    };

    async insertNewCourseFullIngest(ingestionRunId: string, courseId: number, schoolId: number): Promise<string> {
        const [newTask] = await this.db.insert(ingestionTasks).values({
            ingestionRunId,
            kind: "course:FullIngest",
            entityType: "course",
            entityId: String(courseId),
            status: "queued",
            schoolId,
            courseId,
        }).returning();

        return newTask.taskId;
    }

    async insertCourseChangeTasks(ingestionRunId: string, courseId: number, schoolId: number, streamItems: StreamActivityItem[]): Promise<string> {
        // We use a tx because we want to make sure the new task and the stream items get inserted so one doesnt get left hanging
        return await this.db.transaction(async (tx) => {
            const row = {
                ingestionRunId,
                kind: "course:Change",
                entityType: "course",
                entityId: String(courseId),
                status: "queued",
                schoolId,
                courseId,
            } satisfies insertIngestonTask;

            // We hash the url and eventTime to make sure the same course stream item doesnt get ingested twice
            const items = streamItems.map(item => (
                {
                    canvasStreamId: item.id,
                    entityType: item.entityType,
                    htmlUrl: item.htmlUrl,
                    eventTime: item.updated_at,
                    status: "queued",
                    courseId,
                } satisfies insertCourseActivityStream));

            const [task] = await tx.insert(ingestionTasks).values(row).onConflictDoNothing().returning();
            await tx.insert(courseActivityStream).values(items).onConflictDoNothing();

            return task.taskId;
        });
    };

    async updateTaskStatus(newStatus: IngestionTaskStatus, taskId: string): Promise<void> {
        await this.db.update(ingestionTasks)
            .set({ status: newStatus })
            .where(eq(ingestionTasks.taskId, taskId));
    }

    async findCourseIngestionTask(taskId: string): Promise<IngestionTask | undefined> {
        return await this.db.query.ingestionTasks.findFirst(
            {
                columns: {
                    taskId: true,
                    kind: true,
                    entityType: true,
                    entityId: true,
                    status: true,
                    schoolId: true,
                    courseId: true,
                },
                where: eq(ingestionTasks.taskId, taskId),
            },
        );
    }

    async claimIngestionTask(taskId: string): Promise<IngestionTask> {
        return await this.db.transaction(async (tx) => {
            const task = await tx.query.ingestionTasks.findFirst({
                columns: {
                    taskId: true,
                    kind: true,
                    entityType: true,
                    entityId: true,
                    status: true,
                    schoolId: true,
                    courseId: true,
                },
                where: and(
                    eq(ingestionTasks.taskId, taskId),
                    eq(ingestionTasks.status, "queued"),
                ),
            });
            if (!task) {
                tx.rollback();
                throw new Error(`No task for taskId: ${taskId}`);
            };
            await tx.update(ingestionTasks).set({ status: "running" }).where(eq(ingestionTasks.taskId, taskId));

            return task;
        });
    }

    async insertCanvasFetchTaskForFullIngestion(ingestionRunId: string, fetchType: IngestionTaskKind[], courseId: number, schoolId: number): Promise<string[]> {
        const items = fetchType.map(type => ({
            ingestionRunId,
            kind: type,
            entityType: "course",
            entityId: String(courseId),
            status: "queued",
            schoolId,
            courseId,
        } satisfies insertIngestonTask));

        const rows = await this.db.insert(ingestionTasks).values(items).returning();

        return rows.map(r => r.taskId);
    }

    async insertDbWriteTask(ingestionRunId: string, taskKind: IngestionTaskKind, courseId: number, schoolId: number, docId: string, entityType: IngestionTaskET): Promise<string> {
        const task = {
            entityType,
            status: "queued",
            schoolId,
            courseId,
            kind: taskKind,
            entityId: docId,
            ingestionRunId,
        } satisfies insertIngestonTask;

        const [newTask] = await this.db.insert(ingestionTasks).values(task).returning();
        return newTask.taskId;
    };

    async insertProcessSyllabusTask(ingestionRunId: string, taskKind: IngestionTaskKind, courseId: number, schoolId: number, entityType: IngestionTaskET, syllabusId: string): Promise<string> {
        const task = {
            entityType,
            status: "queued",
            schoolId,
            courseId,
            kind: taskKind,
            entityId: syllabusId,
            ingestionRunId,
        } satisfies insertIngestonTask;

        const [newTask] = await this.db.insert(ingestionTasks).values(task).returning();
        return newTask.taskId;
    };

    async insertWriteSyllabusTask(ingestionRunId: string, kind: IngestionTaskKind, courseId: number, schoolId: number, entityType: IngestionTaskET, syllabusId: string): Promise<string> {
        const task = {
            entityType,
            kind,
            schoolId,
            courseId,
            entityId: syllabusId,
            ingestionRunId,
            status: "queued",
        } satisfies insertIngestonTask;

        const [newTask] = await this.db.insert(ingestionTasks).values(task).returning();
        return newTask.taskId;
    }

    async getRunCounts(ingestionRunId: string): Promise<Counts> {
        const [counts] = await this.db.select(
            {
                queuedCount: this.db.$count(ingestionTasks.status, eq(ingestionTasks.status, "queued")),
                successCount: this.db.$count(ingestionTasks.status, eq(ingestionTasks.status, "success")),
                runningCount: this.db.$count(ingestionTasks.status, eq(ingestionTasks.status, "running")),
                failedCount: this.db.$count(ingestionTasks.status, eq(ingestionTasks.status, "failed")),
            },
        )
            .from(ingestionTasks)
            .where(eq(ingestionTasks.ingestionRunId, ingestionRunId));

        return counts;
    }
}