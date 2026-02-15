CREATE SCHEMA "ai";
--> statement-breakpoint
CREATE TABLE "ai"."assignments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."assignments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"assignmentId" bigint,
	"name" text,
	"description" text,
	"dueAt" timestamp,
	"workflowState" text,
	"courseId" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."course_activity_stream" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."course_activity_stream_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvasStreamId" bigint,
	"entityType" text,
	"htmlUrl" text,
	"eventTime" timestamp,
	"dedupHash" text,
	"status" text,
	"courseId" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_activity_stream_dedupHash_unique" UNIQUE("dedupHash")
);
--> statement-breakpoint
CREATE TABLE "ai"."courses" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"courseId" bigint,
	"course_code" text,
	"courseName" text,
	"workflowState" text,
	"canvasUpdatedAt" timestamp,
	"lastSyncedAt" timestamp,
	"schoolId" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_courseId_unique" UNIQUE("courseId")
);
--> statement-breakpoint
CREATE TABLE "ai"."schools" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."schools_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvasBaseUrl" text NOT NULL,
	"schoolColor" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."user_enrollments" (
	"userId" uuid,
	"courseId" bigint,
	"enrollmentState" text,
	"isActive" boolean,
	CONSTRAINT "user_enrollments_userId_courseId_pk" PRIMARY KEY("userId","courseId")
);
--> statement-breakpoint
CREATE TABLE "ai"."user_sync" (
	"userId" uuid,
	"courseId" bigint,
	"lastStreamId" bigint,
	"lastCheckAt" timestamp,
	"status" text,
	CONSTRAINT "user_sync_userId_courseId_pk" PRIMARY KEY("userId","courseId")
);
--> statement-breakpoint
CREATE TABLE "ai"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text,
	"schoolId" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai"."assignments" ADD CONSTRAINT "assignments_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_activity_stream" ADD CONSTRAINT "course_activity_stream_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."courses" ADD CONSTRAINT "courses_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_sync" ADD CONSTRAINT "user_sync_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_sync" ADD CONSTRAINT "user_sync_courseId_courses_id_fk" FOREIGN KEY ("courseId") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."users" ADD CONSTRAINT "users_schoolId_schools_id_fk" FOREIGN KEY ("schoolId") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;