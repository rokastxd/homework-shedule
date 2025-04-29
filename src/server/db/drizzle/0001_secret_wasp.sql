DROP TABLE "account";--> statement-breakpoint
DROP TABLE "verification_token";--> statement-breakpoint
DROP INDEX IF EXISTS "session_user_id_idx";--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "groups" ALTER COLUMN "elder_id" SET DATA TYPE double precision;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'homework'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "homework" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "homework" ALTER COLUMN "deadline" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "homework" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "expires_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "homework" ADD COLUMN "id" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "session_token";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "expires";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "email_verified";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "image";