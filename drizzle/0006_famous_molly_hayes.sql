ALTER TABLE "organizations" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "memberships" DROP COLUMN "is_deleted";--> statement-breakpoint
ALTER TABLE "memberships" DROP COLUMN "deleted_at";