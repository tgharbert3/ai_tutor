import { relations } from "drizzle-orm";
import { bigint, boolean, pgSchema, primaryKey, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const apiSchema = pgSchema("ai");
export const ingestionStatusEnum = apiSchema.enum("ingestion_status", ["queued", "running", "noop", "complete", "failed"]);
// Identifier for the worker
export const ingestionTaskKind = apiSchema.enum("ingestion_task_kind", ["course:Plan", "course:Change", "course:FullIngest", "fetch:AllAssignments", "fetch:CourseInfo", "process:Syllabus", "write:NewCourse", "process:Tabs", "write:Syllabus", "write:UserEnrollment", "write:Course"]);
// Specifies what the entityId user for. If 'assignment' then entityId is assignmentId
export const ingestionTaskEntityType = apiSchema.enum("ingestion_task_entity_type", ["syllabus", "assignment", "course", "tabs", "rawDoc", "courseInfo"]);

export const ingestionTaskStatus = apiSchema.enum("ingestion_task_status", ["queued", "running", "success", "failed", "processing", "processed", "noop"]);

export const coursePlanStatus = typeof ingestionTaskStatus;

const timestamps = {
    updated_at: timestamp({ withTimezone: true }),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const schools = apiSchema.table("schools", {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    canvasBaseUrl: text("canvas_base_url").notNull().unique(),
    schoolColor: text("school_color").default("#6B7280").notNull(),
    ...timestamps,
});
// TODO: add canvasUserId
export const users = apiSchema.table("users", {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    schoolId: bigint("school_id", { mode: "number" }).references(() => schools.id).notNull(),
    ...timestamps,
});

export const courses = apiSchema.table("courses", {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    canvasCourseId: bigint("course_id", { mode: "number" }).notNull(),
    // TODO: make this an enum
    workflowState: text("workflow_state"),
    lastSyncedAt: timestamp("last_synced_at"),
    schoolId: bigint("school_id", { mode: "number" }).references(() => schools.id).notNull(),
    ...timestamps,
}, t => [
    unique().on(t.canvasCourseId, t.schoolId),
]);

export const userEnrollments = apiSchema.table("user_enrollments", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    courseId: bigint("course_id", { mode: "number" }).notNull().references(() => courses.id),
    enrollmentState: text("enrollment_state"),
    canvasUserId: bigint("canvas_user_id", { mode: "number" }),
    canvasCourseId: bigint("canvas_course_id", { mode: "number" }).notNull(),
    schoolId: bigint("school_id", { mode: "number" }).notNull(),
    isActive: boolean("is_active"),
    ...timestamps,
}, table => [
    primaryKey({ columns: [table.userId, table.courseId] }),
    unique().on(table.userId, table.courseId),
]);

export const assignments = apiSchema.table("assignments", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    assignmentId: bigint("assignment_id", { mode: "number" }),
    name: text("name"),
    description: text("description"),
    dueAt: timestamp("due_at"),
    // TODO: make this an enum
    workflowState: text("workflow_state"),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id),
    ...timestamps,
});

export const courseActivityStream = apiSchema.table("course_activity_stream", {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    canvasStreamId: bigint("canvas_stream_id", { mode: "number" }).notNull(),
    entityType: text("entity_type").notNull(),
    htmlUrl: text("html_url").notNull(),
    eventTime: timestamp("event_time").notNull(),
    status: ingestionStatusEnum().notNull(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id).notNull(),
    ...timestamps,
});
export const ingestionRuns = apiSchema.table("ingestion_runs", {
    id: uuid("id").primaryKey().defaultRandom(),
    status: ingestionStatusEnum().notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at"),
    checkpointStart: bigint("checkpoint_start", { mode: "number" }),
    checkpointEnd: bigint ("checkpoint_end", { mode: "number" }),
    error: text("error"),
    userId: uuid("user_id").references(() => users.id).notNull(),
    schoolId: bigint("school_id", { mode: "number" }).references(() => schools.id).notNull(),
});

export const ingestionTasks = apiSchema.table("ingestion_tasks", {
    taskId: uuid("task_id").primaryKey().defaultRandom(),
    kind: ingestionTaskKind("kind").notNull(),
    entityType: ingestionTaskEntityType("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    status: ingestionTaskStatus("status").notNull(),
    canvasCourseId: bigint("canvas_course_id", { mode: "number" }).notNull(),
    schoolId: bigint("school_id", { mode: "number" }).notNull().references(() => schools.id),
    ingestionRunId: uuid("ingestion_run_id").references(() => ingestionRuns.id).notNull(),
    error: text("error"),
    ...timestamps,
});

export const canvasRawDocuments = apiSchema.table("canvas_raw_documents", {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: ingestionTaskEntityType("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    payload: text("payload").notNull(),
    schoolId: bigint("school_id", { mode: "number" }).notNull().references(() => schools.id),
    canvasCourseId: bigint("canvas_course_id", { mode: "number" }).notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
}, t => [
    unique().on(t.canvasCourseId, t.schoolId, t.entityType, t.entityId),
]);

export const courseInfo = apiSchema.table("course_info", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseCode: text("course_code").notNull(),
    name: text("name").notNull(),
    canvasCourseId: bigint("canvas_course_id", { mode: "number" }).notNull(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id).unique(),
    ...timestamps,
});

export const courseSyllabus = apiSchema.table("course_syllabus", {
    id: uuid("id").primaryKey().defaultRandom(),
    sanitizedSyllabus: text("sanitized_syllabus"),
    rawSyllabus: text("raw_syllabus").notNull(),
    plainText: text("plain_text"),
    hash: text(),
    status: ingestionStatusEnum().notNull(),
    courseInfoId: uuid("course_info_id").notNull().references(() => courseInfo.id).unique(),
});

export const courseTabs = apiSchema.table("course_tabs", {
    id: uuid("id").primaryKey().defaultRandom(),
    tabId: text("tab_id").notNull(),
    courseInfoId: uuid("course_info_id").notNull().references(() => courseInfo.id),
}, table => [
    unique().on(table.courseInfoId, table.tabId),
]);

// Relations:
// 1. Schools Relations
export const schoolsRelations = relations(schools, ({ many }) => ({
    users: many(users),
    courses: many(courses),
    ingestionRuns: many(ingestionRuns),
}));

// 2. Users Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    school: one(schools, {
        fields: [users.schoolId],
        references: [schools.id],
    }),
    userEnrollments: many(userEnrollments),
    ingestionRuns: many(ingestionRuns),
}));

// 3. Courses Relations
export const coursesRelations = relations(courses, ({ one, many }) => ({
    school: one(schools, {
        fields: [courses.schoolId],
        references: [schools.id],
    }),
    userEnrollments: many(userEnrollments),
    assignments: many(assignments),
    courseActivityStream: many(courseActivityStream),
}));

// 4. User Enrollments (Join Table)
export const userEnrollmentsRelations = relations(userEnrollments, ({ one }) => ({
    user: one(users, {
        fields: [userEnrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [userEnrollments.canvasCourseId],
        references: [courses.id],
    }),
}));

// 6. Assignments Relations
export const assignmentsRelations = relations(assignments, ({ one }) => ({
    course: one(courses, {
        fields: [assignments.courseId],
        references: [courses.id],
    }),
}));

// 7. Activity Stream Relations
export const courseActivityStreamRelations = relations(courseActivityStream, ({ one }) => ({
    course: one(courses, {
        fields: [courseActivityStream.courseId],
        references: [courses.id],
    }),
}));

// Ingestion run Relations

export const ingestionRunRelations = relations(ingestionRuns, ({ one, many }) => ({
    user: one(users, {
        fields: [ingestionRuns.userId],
        references: [users.id],
    }),

    schools: one(schools, {
        fields: [ingestionRuns.schoolId],
        references: [schools.id],
    }),

    ingestionTasks: many(ingestionTasks),
}));

// Ingestion task relations
export const ingestionTaskRelations = relations(ingestionTasks, ({ one }) => ({
    ingestionRun: one(ingestionRuns, {
        fields: [ingestionTasks.ingestionRunId],
        references: [ingestionRuns.id],
    }),
}));

export const courseInfoRelations = relations(courseInfo, ({ one, many }) => ({
    courseTabs: many(courseTabs),
    courseSyllabus: one(courseSyllabus, {
        fields: [courseInfo.id],
        references: [courseSyllabus.courseInfoId],
    }),
}));

export const courseSyllabusRelations = relations(courseSyllabus, ({ one }) => ({
    courseInfo: one(courseInfo, {
        fields: [courseSyllabus.courseInfoId],
        references: [courseInfo.id],
    }),
}));

export const courseTabsRelations = relations(courseTabs, ({ one }) => ({
    courseInfo: one(courseInfo, {
        fields: [courseTabs.courseInfoId],
        references: [courseInfo.id],
    }),
}));

// Schemas
export const selectCourseSchema = createSelectSchema(courses)
    .omit({
        id: true,
        created_at: true,
        updated_at: true,
    });
export const insertCourseSchema = createInsertSchema(
    courses,
    {
        canvasCourseId: schema => schema.min(1),
    },
);

// TODO: Extract this
export type getUsers = typeof users.$inferSelect;
export type insertUser = typeof users.$inferSelect;

export type getCourses = typeof courses.$inferSelect;
export type insertCourseType = typeof courses.$inferInsert;

export type getSchools = typeof schools.$inferSelect;
export type insertSchools = typeof schools.$inferInsert;

export type getUserEnrollments = typeof userEnrollments.$inferSelect;
export type insertUserEnrollment = typeof userEnrollments.$inferInsert;

export type getAssignments = typeof assignments.$inferSelect;
export type insertAssignment = typeof assignments.$inferInsert;

export type getCourseActivityStream = typeof courseActivityStream.$inferSelect;
export type insertCourseActivityStream = typeof courseActivityStream.$inferInsert;

export type getIngestionRuns = typeof ingestionRuns.$inferSelect;
export type insertIngestonRun = typeof ingestionRuns.$inferInsert;

export type getIngestionTask = typeof ingestionTasks.$inferSelect;
export type insertIngestonTask = typeof ingestionTasks.$inferInsert;

export type insertTabs = typeof courseTabs.$inferInsert;

export type insertCourseInfo = typeof courseInfo.$inferInsert;
export type getCourseInfo = typeof courseInfo.$inferSelect;

export type getCanvasRawDocument = typeof canvasRawDocuments.$inferSelect;