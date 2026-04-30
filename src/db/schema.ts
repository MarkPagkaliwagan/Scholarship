import { pgTable, serial, varchar, text, smallint, numeric, timestamp, boolean, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).unique(),
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
    monthlyIncome: varchar("monthly_income", { length: 30 }),
    numberOfSiblings: smallint("number_of_siblings"),
    guardianOccupation: varchar("guardian_occupation", { length: 255 }),
    guardianEmploymentStatus: varchar("guardian_employment_status", { length: 30 }),
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

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
