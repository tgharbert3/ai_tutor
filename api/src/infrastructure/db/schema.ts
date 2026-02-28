import { relations } from "drizzle-orm";
import { bigint, boolean, pgEnum, pgSchema, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const ingestionStatusEnum = pgEnum("ingestion_status", ["queued", "running", "noop", "complete", "failed"]);

export const apiSchema = pgSchema("ai");

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
    courseId: bigint("course_id", { mode: "number" }).unique(),
    courseCode: text("course_code"),
    courseName: text("course_name"),
    // TODO: make this an enum
    workflowState: text("workflow_state"),
    canvasUpdatedAt: timestamp("canvas_updated_at"),
    lastSyncedAt: timestamp("last_synced_at"),
    schoolId: bigint("school_id", { mode: "number" }).references(() => schools.id).notNull(),
    ...timestamps,
});

export const userEnrollments = apiSchema.table("user_enrollments", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id).notNull(),
    enrollmentState: text("enrollment_state"),
    canvasUserId: bigint("canvas_user_id", { mode: "number" }),
    isActive: boolean("is_active"),
    ...timestamps,
}, table => [
    primaryKey({ columns: [table.userId, table.courseId] }),
]);

export const userSync = apiSchema.table("user_sync", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id).notNull(),
    lastStreamId: bigint("last_stream_id", { mode: "number" }),
    lastCheckAt: timestamp("last_check_at"),
    // TODO: make this an enum
    status: text("status"),
}, table => [
    primaryKey({ columns: [table.userId, table.courseId] }),
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
    canvasStreamId: bigint("canvas_stream_id", { mode: "number" }),
    entityType: text("entity_type"),
    htmlUrl: text("html_url"),
    eventTime: timestamp("event_time"),
    dedupHash: text("dedup_hash").unique(),
    status: text("status"),
    courseId: bigint("course_id", { mode: "number" }).references(() => courses.id),
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
    userSync: many(userSync),
    ingestionRuns: many(ingestionRuns),
}));

// 3. Courses Relations
export const coursesRelations = relations(courses, ({ one, many }) => ({
    school: one(schools, {
        fields: [courses.schoolId],
        references: [schools.id],
    }),
    userEnrollments: many(userEnrollments),
    userSync: many(userSync),
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
        fields: [userEnrollments.courseId],
        references: [courses.id],
    }),
}));

// 5. User Sync Relations
export const userSyncRelations = relations(userSync, ({ one }) => ({
    user: one(users, {
        fields: [userSync.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [userSync.courseId],
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

export const ingestionRunRelations = relations(ingestionRuns, ({ one }) => ({
    user: one(users, {
        fields: [ingestionRuns.userId],
        references: [users.id],
    }),

    schools: one(schools, {
        fields: [ingestionRuns.schoolId],
        references: [schools.id],
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
        courseId: schema => schema.min(1),
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

export type getUserSync = typeof userSync.$inferSelect;
export type insertUserSync = typeof userSync.$inferInsert;

export type getAssignments = typeof assignments.$inferSelect;
export type insertAssignment = typeof assignments.$inferInsert;

export type getCourseActivityStream = typeof courseActivityStream.$inferSelect;
export type insertCourseActivityStream = typeof courseActivityStream.$inferInsert;

export type getIngestionRuns = typeof ingestionRuns.$inferSelect;
export type insertIngestonRun = typeof ingestionRuns.$inferInsert;