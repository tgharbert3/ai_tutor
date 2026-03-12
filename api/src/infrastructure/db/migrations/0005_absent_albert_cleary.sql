ALTER TABLE "ai"."course_info" DROP CONSTRAINT "course_info_canvas_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "ai"."course_info" ADD COLUMN "course_id" bigint;--> statement-breakpoint
ALTER TABLE "ai"."course_info" ADD CONSTRAINT "course_info_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "ai"."courses"("id") ON DELETE no action ON UPDATE no action;