ALTER TABLE "wish_comments" DROP CONSTRAINT "wish_comments_wish_id_wishes_id_fk";
--> statement-breakpoint
ALTER TABLE "wish_comments" DROP CONSTRAINT "wish_comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "wish_questions" DROP CONSTRAINT "wish_questions_wish_id_wishes_id_fk";
--> statement-breakpoint
ALTER TABLE "wish_questions" DROP CONSTRAINT "wish_questions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_comments" ADD CONSTRAINT "wish_comments_wish_id_wishes_id_fk" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_comments" ADD CONSTRAINT "wish_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_questions" ADD CONSTRAINT "wish_questions_wish_id_wishes_id_fk" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_questions" ADD CONSTRAINT "wish_questions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
