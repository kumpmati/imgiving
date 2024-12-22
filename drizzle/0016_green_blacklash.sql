CREATE TABLE "user_notifications" (
	"user_id" text,
	"token" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_notifications_user_id_token_pk" PRIMARY KEY("user_id","token")
);
--> statement-breakpoint
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;