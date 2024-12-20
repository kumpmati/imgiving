CREATE TABLE "list_invites" (
	"id" text PRIMARY KEY NOT NULL,
	"list_id" text NOT NULL,
	"author_id" text NOT NULL,
	"created_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wishes" DROP CONSTRAINT "wishes_list_id_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "wishes" DROP CONSTRAINT "wishes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "list_invites" ADD CONSTRAINT "list_invites_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_invites" ADD CONSTRAINT "list_invites_created_user_id_users_id_fk" FOREIGN KEY ("created_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "list_invite_list_id_index" ON "list_invites" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "list_invite_author_id_index" ON "list_invites" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "list_invite_created_at_index" ON "list_invites" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;