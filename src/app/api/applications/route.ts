import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";

const INCOME_VALUES = ["below_5000", "5000_10000", "10000_20000", "20000_30000", "above_30000"] as const;
const EMPLOYMENT_VALUES = ["employed", "self_employed", "unemployed", "ofw", "deceased"] as const;

const bodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().regex(/^09\d{9}$/),
  address: z.string().min(10),
  schoolName: z.string().min(3),
  course: z.string().min(2),
  yearLevel: z.coerce.number().int().min(1).max(5),
  gwa: z.coerce.number().min(0).max(100),
  monthlyIncome: z.enum(INCOME_VALUES).optional(),
  numberOfSiblings: z.coerce.number().int().min(0).max(20).optional(),
  guardianOccupation: z.string().min(2).optional(),
  guardianEmploymentStatus: z.enum(EMPLOYMENT_VALUES).optional(),
});

const patchSchema = bodySchema.omit({ email: true }).partial();

function generateApplicationId(): string {
  return `SPC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

async function getCurrentUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

async function getOwnedApplicationId(user: { id: string; email: string }) {
  const [linked] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.userId, user.id))
    .limit(1);

  if (linked) return linked.id;

  const [legacy] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(isNull(applications.userId), eq(applications.email, user.email)))
    .orderBy(desc(applications.submittedAt), desc(applications.id))
    .limit(1);

  return legacy?.id ?? null;
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownedApplicationId = await getOwnedApplicationId(user);
  if (!ownedApplicationId) {
    return NextResponse.json([]);
  }

  const apps = await db.select().from(applications).where(eq(applications.id, ownedApplicationId));
  return NextResponse.json(apps);
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const ownedApplicationId = await getOwnedApplicationId(user);
  if (!ownedApplicationId) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  await db.update(applications).set({
    firstName: data.firstName,
    lastName: data.lastName,
    email: user.email,
    phone: data.phone,
    address: data.address,
    schoolName: data.schoolName,
    course: data.course,
    yearLevel: data.yearLevel,
    gwa: String(data.gwa),
    updatedAt: new Date(),
  }).where(eq(applications.id, ownedApplicationId));

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const ownedApplicationId = await getOwnedApplicationId(user);
  if (!ownedApplicationId) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const updateData = {
    ...parsed.data,
    gwa: parsed.data.gwa !== undefined ? String(parsed.data.gwa) : undefined,
    yearLevel: parsed.data.yearLevel !== undefined ? Number(parsed.data.yearLevel) : undefined,
    numberOfSiblings: parsed.data.numberOfSiblings !== undefined ? Number(parsed.data.numberOfSiblings) : undefined,
    updatedAt: new Date(),
  };

  await db.update(applications).set(updateData).where(eq(applications.id, ownedApplicationId));

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const applicationId = generateApplicationId();
  const existingApplicationId = await getOwnedApplicationId(user);
  if (existingApplicationId) {
    return NextResponse.json({ error: "Application already exists" }, { status: 409 });
  }

  await db.insert(applications).values({
    userId: user.id,
    applicationId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: user.email,
    phone: data.phone,
    address: data.address,
    schoolName: data.schoolName,
    course: data.course,
    yearLevel: data.yearLevel,
    gwa: String(data.gwa),
    monthlyIncome: data.monthlyIncome ?? null,
    numberOfSiblings: data.numberOfSiblings ?? null,
    guardianOccupation: data.guardianOccupation ?? null,
    guardianEmploymentStatus: data.guardianEmploymentStatus ?? null,
  });

  return NextResponse.json({ applicationId }, { status: 201 });
}
