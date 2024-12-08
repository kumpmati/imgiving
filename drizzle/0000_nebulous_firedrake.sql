CREATE TABLE IF NOT EXISTS "lists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "list_created_at_index" ON "lists" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_created_at_index" ON "users" USING btree ("created_at");