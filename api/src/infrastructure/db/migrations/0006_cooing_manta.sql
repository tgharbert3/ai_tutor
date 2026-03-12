ALTER TYPE "ai"."ingestion_task_entity_type" ADD VALUE 'courseInfo';--> statement-breakpoint
ALTER TABLE "ai"."ingestion_tasks" ALTER COLUMN "kind" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "ai"."ingestion_task_kind";--> statement-breakpoint
CREATE TYPE "ai"."ingestion_task_kind" AS ENUM('course:Plan', 'course:Change', 'course:FullIngest', 'fetch:AllAssignments', 'fetch:CourseInfo', 'process:Syllabus', 'write:NewCourse', 'process:Tabs', 'write:Syllabus', 'write:UserEnrollment', 'write:Course');--> statement-breakpoint
ALTER TABLE "ai"."ingestion_tasks" ALTER COLUMN "kind" SET DATA TYPE "ai"."ingestion_task_kind" USING "kind"::"ai"."ingestion_task_kind";