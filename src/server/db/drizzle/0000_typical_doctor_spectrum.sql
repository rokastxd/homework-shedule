CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" double precision PRIMARY KEY NOT NULL,
	"group_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name_group" varchar NOT NULL,
	"elder_id" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "homework" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"discipline" varchar NOT NULL,
	"group_id" varchar NOT NULL,
	"body" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"deadline" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "disciplines" (
	"discipline" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
