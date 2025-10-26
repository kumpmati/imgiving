ALTER TABLE "wishes" ADD COLUMN "price_cents" integer;--> statement-breakpoint
ALTER TABLE "wishes" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "wishes" DROP COLUMN "price";