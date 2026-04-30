ALTER TABLE "applications" ADD COLUMN "user_id" text;
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_unique" UNIQUE("user_id");
