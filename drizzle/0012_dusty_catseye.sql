CREATE TYPE "public"."activity_action" AS ENUM('ORGANIZATION_CREATED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_ARCHIVED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_ASSIGNED', 'TASK_COMPLETED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'ROLE_CHANGED');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('ORGANIZATION', 'PROJECT', 'TASK', 'MEMBERSHIP', 'INVITE');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_membership_id" uuid,
	"action" "activity_action" NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_membership_id_memberships_id_fk" FOREIGN KEY ("actor_membership_id") REFERENCES "public"."memberships"("id") ON DELETE set null ON UPDATE no action;