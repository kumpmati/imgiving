ALTER TABLE "wishes" ALTER COLUMN "last_seen_question" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "wishes" ALTER COLUMN "last_seen_question" SET NOT NULL;