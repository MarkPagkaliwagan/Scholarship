CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer,
	"document_name" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"file_name" varchar(255),
	"file_path" text,
	"file_size" integer,
	"mime_type" varchar(100),
	"uploaded_at" timestamp with time zone,
	CONSTRAINT "status_check" CHECK ("documents"."status" IN ('pending', 'submitted', 'approved', 'rejected'))
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;