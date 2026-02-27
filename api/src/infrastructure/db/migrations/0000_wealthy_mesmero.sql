CREATE SCHEMA "ai";
--> statement-breakpoint
CREATE TABLE "ai"."assignments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."assignments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"assignment_id" bigint,
	"name" text,
	"description" text,
	"due_at" timestamp,
	"workflow_state" text,
	"course_id" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai"."course_activity_stream" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."course_activity_stream_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvas_stream_id" bigint,
	"entity_type" text,
	"html_url" text,
	"event_time" timestamp,
	"dedup_hash" text,
	"status" text,
	"course_id" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_activity_stream_dedupHash_unique" UNIQUE("dedup_hash")
);
--> statement-breakpoint
CREATE TABLE "ai"."courses" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"course_id" bigint,
	"course_code" text,
	"course_name" text,
	"workflow_state" text,
	"canvas_updated_at" timestamp,
	"last_synced_at" timestamp,
	"school_id" bigint,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_courseId_unique" UNIQUE("course_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."schools" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai"."schools_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"canvas_base_url" text NOT NULL,
	"school_color" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schools_canvas_base_url_unique" UNIQUE("canvas_base_url")
);
--> statement-breakpoint
CREATE TABLE "ai"."user_enrollments" (
	"user_id" uuid NOT NULL,
	"course_id" bigint NOT NULL,
	"enrollment_state" text,
	"canvas_user_id" bigint,
	"is_active" boolean,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_enrollments_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."user_sync" (
	"user_id" uuid NOT NULL,
	"course_id" bigint NOT NULL,
	"last_stream_id" bigint,
	"last_check_at" timestamp,
	"status" text,
	CONSTRAINT "user_sync_user_id_course_id_pk" PRIMARY KEY("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "ai"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"school_id" bigint NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai"."assignments" ADD CONSTRAINT "assignments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."course_activity_stream" ADD CONSTRAINT "course_activity_stream_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."courses" ADD CONSTRAINT "courses_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_enrollments" ADD CONSTRAINT "user_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_sync" ADD CONSTRAINT "user_sync_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "ai"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."user_sync" ADD CONSTRAINT "user_sync_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai"."users" ADD CONSTRAINT "users_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "ai"."schools"("id") ON DELETE no action ON UPDATE no action;