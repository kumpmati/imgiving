ALTER TABLE "users" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "user_verified_at_index" ON "users" USING btree ("verified_at");