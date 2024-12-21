ALTER TABLE "list_invites" DROP CONSTRAINT "list_invites_created_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "list_invites" DROP COLUMN "created_user_id";