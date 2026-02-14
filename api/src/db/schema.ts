import { relations } from "drizzle-orm";
import { bigint, boolean, pgSchema, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const apiSchema = pgSchema("ai")

const timestamps = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull()
}

export const users = apiSchema.table("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email"),
    schoolId: bigint({ mode: "number"}).references(() => schools.id),
    ...timestamps,
});

export const schools = apiSchema.table("schools", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    canvasBaseUrl: text("canvasBaseUrl").notNull(),
    schoolColor: text(),
    ...timestamps,
});

export const courses = apiSchema.table("courses", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    courseId: bigint({ mode: "number"}),
    courseCode: text("course_code"),
    // TODO: make this an enum
    workflowState: text(),
    canvasUpdatedAt: timestamp(),
    lastSyncedAt: timestamp(),
    schoolId: bigint({ mode: "number" }).references(() => schools.id),
    ...timestamps,
});

export const userEnrollments = apiSchema.table("user_enrollments", {
    userId: uuid().references(() => users.id),
    courseId: bigint({ mode: "number" }).references(() => courses.id),
    enrollmentState: text(), 
    isActive: boolean(),
}, (table) => [
    primaryKey({columns: [table.userId, table.courseId]})
]);

export const userSync = apiSchema.table("user_sync", {
    userId: uuid().references(() => users.id),
    courseId: bigint({ mode: "number" }).references(() => courses.id),
    lastStreamId: bigint({ mode: "number"}), 
    lastCheckAt: timestamp(),
    // TODO: make this an enum
    status: text(),
}, (table) => [
    primaryKey({columns: [table.userId, table.courseId]})
]);

export const assignments = apiSchema.table("assignments", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    assignmentId: bigint({ mode: "number" }),
    name: text(),
    description: text(), 
    dueAt: timestamp(),
    // TODO: make this an enum
    workflowState: text(),
    courseId: bigint({ mode: "number" }).references(() => courses.id),
    ...timestamps,
});

export const courseActivityStream = apiSchema.table("course_activity_stream", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    canvasStreamId: bigint({ mode: "number" }),
    entityType: text(),
    htmlUrl: text(),
    eventTime: timestamp(),
    dedupHash: text().unique(),
    status: text(),
    courseId: bigint({ mode: "number" }).references(() => courses.id),
    ...timestamps,
})


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
        references: [courses.id]
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
        created_at: true,
        updated_at: true,
    });
export const insertCourseSchema = createInsertSchema(
    courses,
    {
        courseId: schema => schema.min(1),
    },
);

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
