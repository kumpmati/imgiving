CREATE TABLE IF NOT EXISTS "wish_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"wish_id" text NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wish_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"wish_id" text NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wishes" ADD COLUMN "last_seen_question" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_comments" ADD CONSTRAINT "wish_comments_wish_id_wishes_id_fk" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_comments" ADD CONSTRAINT "wish_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_questions" ADD CONSTRAINT "wish_questions_wish_id_wishes_id_fk" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_questions" ADD CONSTRAINT "wish_questions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wish_comment_wish_id_index" ON "wish_comments" USING btree ("wish_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wish_comment_created_at_index" ON "wish_comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wish_question_wish_id_index" ON "wish_questions" USING btree ("wish_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wish_question_created_at_index" ON "wish_questions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wish_created_at_index" ON "wishes" USING btree ("created_at");