ALTER TABLE "wish_comments" ADD COLUMN "list_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "wish_questions" ADD COLUMN "list_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "wish_comments" ADD CONSTRAINT "wish_comments_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wish_questions" ADD CONSTRAINT "wish_questions_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;