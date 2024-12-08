CREATE TABLE IF NOT EXISTS "wish_status" (
	"wish_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wish_status_wish_id_user_id_pk" PRIMARY KEY("wish_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "wishes" ALTER COLUMN "updated_at" SET DEFAULT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_status" ADD CONSTRAINT "wish_status_wish_id_wishes_id_fk" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wish_status" ADD CONSTRAINT "wish_status_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
