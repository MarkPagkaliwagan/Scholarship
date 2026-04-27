import { pgTable, serial, varchar, text, smallint, numeric, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    applicationId: varchar("application_id", { length: 20 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    schoolName: varchar("school_name", { length: 255 }).notNull(),
    course: varchar("course", { length: 255 }).notNull(),
    yearLevel: smallint("year_level").notNull(),
    gwa: numeric("gwa", { precision: 5, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    remarks: text("remarks"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check("status_check", sql`${t.status} IN ('pending', 'in_review', 'approved', 'rejected')`),
    check("year_level_check", sql`${t.yearLevel} BETWEEN 1 AND 5`),
  ]
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
