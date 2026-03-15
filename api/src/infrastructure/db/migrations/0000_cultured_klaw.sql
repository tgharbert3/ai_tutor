CREATE SCHEMA "ai";
--> statement-breakpoint
CREATE TYPE "ai"."ingestion_status" AS ENUM('queued', 'running', 'noop', 'complete', 'failed');--> statement-breakpoint
CREATE TYPE "ai"."ingestion_task_entity_type" AS ENUM('syllabus', 'assignment', 'course', 'tabs', 'rawDoc', 'courseInfo');--> statement-breakpoint
CREATE TYPE "ai"."ingestion_task_kind" AS ENUM('course:Plan', 'course:Change', 'course:FullIngest', 'fetch:AllAssignments', 'fetch:CourseInfo', 'process:Syllabus', 'write:NewCourse', 'process:Tabs', 'write:Syllabus', 'write:UserEnrollment', 'write:Course');--> statement-breakpoint
CREATE TYPE "ai"."ingestion_task_status" AS ENUM('queued', 'running', 'success', 'failed', 'processing', 'processed');--> statement-breakpoint
CREATE TABLE "ai"."assignments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."assignments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"assignment_id" bigint,
	"name" text,
	"description" text,
	"due_at" timestamp,
	"workflow_state" text,
	"course_id" bigint,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."canvas_raw_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "ai"."ingestion_task_entity_type" NOT NULL,
	"entity_id" text NOT NULL,
	"payload" text NOT NULL,
	"school_id" bigint NOT NULL,
	"canvas_course_id" bigint NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "canvas_raw_documents_canvas_course_id_school_id_entity_type_entity_id_unique" UNIQUE("canvas_course_id","school_id","entity_type","entity_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."course_activity_stream" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."course_activity_stream_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvas_stream_id" bigint NOT NULL,
	"entity_type" text NOT NULL,
	"html_url" text NOT NULL,
	"event_time" timestamp NOT NULL,
	"status" "ai"."ingestion_status" NOT NULL,
	"course_id" bigint NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."course_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_code" text NOT NULL,
	"name" text NOT NULL,
	"canvas_course_id" bigint NOT NULL,
	"course_id" bigint
);
--> statement-breakpoint
CREATE TABLE "ai"."course_syllabus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sanitized_syllabus" text,
	"raw_syllabus" text NOT NULL,
	"plain_text" text,
	"hash" text,
	"status" "ai"."ingestion_status" NOT NULL,
	"course_info_id" uuid NOT NULL,
	CONSTRAINT "course_syllabus_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "ai"."course_tabs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tab_id" text NOT NULL,
	"course_info_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."courses" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"course_id" bigint NOT NULL,
	"workflow_state" text,
	"last_synced_at" timestamp,
	"school_id" bigint NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_course_id_school_id_unique" UNIQUE("course_id","school_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."ingestion_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "ai"."ingestion_status" NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"checkpoint_start" bigint,
	"checkpoint_end" bigint,
	"error" text,
	"user_id" uuid NOT NULL,
	"school_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."ingestion_tasks" (
	"task_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "ai"."ingestion_task_kind" NOT NULL,
	"entity_type" "ai"."ingestion_task_entity_type" NOT NULL,
	"entity_id" text NOT NULL,
	"status" "ai"."ingestion_task_status" NOT NULL,
	"canvas_course_id" bigint NOT NULL,
	"school_id" bigint NOT NULL,
	"ingestion_run_id" uuid NOT NULL,
	"error" text,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."schools" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."schools_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvas_base_url" text NOT NULL,
	"school_color" text DEFAULT '#6B7280' NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "schools_canvas_base_url_unique" UNIQUE("canvas_base_url")
);
--> statement-breakpoint
CREATE TABLE "ai"."user_enrollments" (
	"user_id" uuid NOT NULL,
	"course_id" bigint NOT NULL,
	"enrollment_state" text,
	"canvas_user_id" bigint,
	"canvas_course_id" bigint NOT NULL,
	"school_id" bigint NOT NULL,
	"is_active" boolean,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_enrollments_user_id_course_id_pk" PRIMARY KEY("user_id","course_id"),
	CONSTRAINT "user_enrollments_user_id_course_id_unique" UNIQUE("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"school_id" bigint NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai"."assignments" ADD CONSTRAINT "assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."canvas_raw_documents" ADD CONSTRAINT "canvas_raw_documents_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_activity_stream" ADD CONSTRAINT "course_activity_stream_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_info" ADD CONSTRAINT "course_info_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_syllabus" ADD CONSTRAINT "course_syllabus_course_info_id_course_info_id_fk" FOREIGN KEY ("course_info_id") REFERENCES "ai"."course_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_tabs" ADD CONSTRAINT "course_tabs_course_info_id_course_info_id_fk" FOREIGN KEY ("course_info_id") REFERENCES "ai"."course_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."courses" ADD CONSTRAINT "courses_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."ingestion_runs" ADD CONSTRAINT "ingestion_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."ingestion_runs" ADD CONSTRAINT "ingestion_runs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."ingestion_tasks" ADD CONSTRAINT "ingestion_tasks_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."ingestion_tasks" ADD CONSTRAINT "ingestion_tasks_ingestion_run_id_ingestion_runs_id_fk" FOREIGN KEY ("ingestion_run_id") REFERENCES "ai"."ingestion_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."users" ADD CONSTRAINT "users_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;