CREATE TABLE "auth"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"family_jti" text NOT NULL,
	"jti" text NOT NULL,
	"parent_jti" text,
	"is_revoked" timestamp,
	"expired_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token"),
	CONSTRAINT "refresh_tokens_jti_unique" UNIQUE("jti"),
	CONSTRAINT "refresh_tokens_parent_jti_unique" UNIQUE("parent_jti")
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"canvas_token" text NOT NULL,
	"full_url" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;