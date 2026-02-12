import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
    id: integer("id", { mode: "number"}).primaryKey({ autoIncrement: true}), 
    email: text("email").notNull(),
    schoolId: integer("school_id").references(() => schools.id)
})

export const schools = sqliteTable("schools", {
    id: integer("id", { mode: "number"}).primaryKey({ autoIncrement: true}),
    canvasBaseUrl: text("cavas_base_url").notNull(),
    schoolColor: text("school_color")
});

export const courses = sqliteTable("courses", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    courseId: integer("courseId").notNull().unique(),
    courseName: text("courseName").notNull().default(""),
    courseCode: text("courseCode").notNull().default(""),
    // TODO: make this an enum
    workflowState: text("worflow_state").notNull(),
    canvasUpdatedAt: integer("canvas_updated_at",{ mode: "timestamp"}),
    lastSyncedAt: integer("last_synced_at", {mode: "timestamp"}),
    schoolId: integer("schoolId").references(() => schools.id),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const userEnrollments = sqliteTable("user_enrollments", {
    userId: integer("user_id").notNull().references(() => users.id),
    courseId: integer("course_id").notNull().references(() => courses.id),
    // TODO: make this an enum
    enrollmentState: text("enrollment_state"),
    isActive: integer("is_active", { mode: "boolean"}),
},
    (t) => [primaryKey({columns: [t.userId, t.courseId]})]
);

export const userSync = sqliteTable("user_sync", {
    userId: integer("user_id").notNull().references(() => users.id),
    courseId: integer("course_id").notNull().references(() => courses.id),
    lastStreamId: integer("last_stream_id"),
    lastCheckedAt: integer("last_checked_at", { mode: "timestamp"}),
    //TODO: make this an enum
    status: text("status").notNull().default("inactive")
},
    (t) => [primaryKey({columns: [t.userId, t.courseId]})]
);

export const assignments = sqliteTable("assignments", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    assignmentId: integer("assignment_id", { mode: "number" }).notNull(),
    name: text("name"),
    description: text("description"),
    dueAt: integer("due_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
    // TODO: make this an enum
    workflowState: text("workflow_state"),
    courseId: integer("course_id", { mode: "number" }).references(() => courses.courseId) 
});

export const courseActivityStream = sqliteTable("course_activity_stream", {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    canvasStreamId: integer("canvas_stream_id", { mode: "number" }),
    entityType: text("entity_type"),
    htmlUrl: text("html_url"),
    eventTime: integer("event_time", { mode: "timestamp"}),
    dedupHash: text("dedup_hash").unique(),
    status: text("status"),
    createdAt: integer("created_at", { mode: "timestamp"}),
    courseId: integer("course_id", { mode: 'number' }).references(() => courses.id)
});

// Relations: 
export const userToCourseRelations = relations(users, ({ many }) => ({
    userEnrollmets: many(userEnrollments)
}));

export const coursesToUserRelations = relations(courses, ({ many }) => ({
    userEnrollments: many(userEnrollments)
}));

export const userEnrollmentRelations = relations(userEnrollments, ({ one }) => ({
    user: one(users, {
        fields: [userEnrollments.userId],
        references: [users.id]
    }),
    course: one(courses, {
        fields: [userEnrollments.courseId],
        references: [courses.id]
    })
}));
 
export const schoolToUserRelations = relations(schools, ({ one }) => ({
    user: one(users),
}));

export const userToSchoolrelation = relations(users, ({ one }) => ({
    school: one(schools, { fields: [users.schoolId], references: [schools.id]}),
}));

export const schoolToCourseRelation = relations(schools, ({ many }) => ({
    courses: many(courses),
}));

export const courseToSchoolRelation = relations(courses, ({ one }) => ({
    school: one(schools, {
        fields: [courses.schoolId],
        references: [schools.id]
    }),
}));

export const userToUserSync = relations(users, ({ many }) => ({
    userSync: many(userSync)
}));

export const courseToUserSync = relations(courses, ({ many }) => ({
    course: many(userSync)
}));

export const userSyncRelations = relations(userSync, ({ one }) => ({
    user: one(users, {
        fields: [userSync.userId],
        references: [users.id]
    }),
    course: one(courses, {
        fields: [userSync.courseId],
        references: [courses.id]
    }),
}));

export const courseToAssignmentrelations = relations(courses, ({ many }) => ({
    assignment: many(assignments),
}));

export const assignmentToCourseRelation = relations(assignments, ({ one }) => ({
    course: one(courses, {
        fields: [assignments.courseId],
        references: [courses.courseId]
    }),
}))

export const courseToCourseActivityStreamRelation = relations(courses, ({ many }) => ({
    courseActivityStream: many(courseActivityStream),
}));

export const courseActivityStreamToCourse = relations(courseActivityStream, ({ one }) => ({
    course: one(courses, { 
        fields: [courseActivityStream.courseId],
        references: [courses.id]
    }),
}));

// Schemas
export const selectCourseSchema = createSelectSchema(courses)
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    });
export const insertCourseSchema = createInsertSchema(
    courses,
    {
        courseId: schema => schema.min(1),
    },
)
    .omit({
        id: true,
    });

//TODO: Extract this
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
