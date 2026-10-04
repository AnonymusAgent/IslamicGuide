CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"reference" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"arabic" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"surah_number" integer NOT NULL,
	"ayah_number" integer NOT NULL,
	"color" text NOT NULL,
	"verse_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"reference" text NOT NULL,
	"content" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"surah_number" integer,
	"ayah_number" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"surah_number" integer NOT NULL,
	"ayah_number" integer NOT NULL,
	"total_ayahs" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asma_favorites" (
	"user_id" uuid NOT NULL,
	"number" integer NOT NULL,
	CONSTRAINT "asma_favorites_user_id_number_pk" PRIMARY KEY("user_id","number")
);
--> statement-breakpoint
CREATE TABLE "favorite_duas" (
	"user_id" uuid NOT NULL,
	"dua_id" text NOT NULL,
	CONSTRAINT "favorite_duas_user_id_dua_id_pk" PRIMARY KEY("user_id","dua_id")
);
--> statement-breakpoint
CREATE TABLE "name_favorites" (
	"user_id" uuid NOT NULL,
	"name_id" text NOT NULL,
	CONSTRAINT "name_favorites_user_id_name_id_pk" PRIMARY KEY("user_id","name_id")
);
--> statement-breakpoint
CREATE TABLE "fasting_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"fasted" boolean DEFAULT true NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salah_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"fajr" boolean DEFAULT false NOT NULL,
	"dhuhr" boolean DEFAULT false NOT NULL,
	"asr" boolean DEFAULT false NOT NULL,
	"maghrib" boolean DEFAULT false NOT NULL,
	"isha" boolean DEFAULT false NOT NULL,
	"journal" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasbeeh_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asma_favorites" ADD CONSTRAINT "asma_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_duas" ADD CONSTRAINT "favorite_duas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_favorites" ADD CONSTRAINT "name_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fasting_days" ADD CONSTRAINT "fasting_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salah_records" ADD CONSTRAINT "salah_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasbeeh_history" ADD CONSTRAINT "tasbeeh_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_type_reference_unique" ON "bookmarks" USING btree ("user_id","type","reference");--> statement-breakpoint
CREATE UNIQUE INDEX "highlights_user_verse_unique" ON "highlights" USING btree ("user_id","surah_number","ayah_number");--> statement-breakpoint
CREATE INDEX "notes_user_created_at_idx" ON "notes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reading_progress_user_id_unique" ON "reading_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_conversations_user_updated_at_idx" ON "ai_conversations" USING btree ("user_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "fasting_days_user_date_unique" ON "fasting_days" USING btree ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "salah_records_user_date_unique" ON "salah_records" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "tasbeeh_history_user_date_idx" ON "tasbeeh_history" USING btree ("user_id","date");