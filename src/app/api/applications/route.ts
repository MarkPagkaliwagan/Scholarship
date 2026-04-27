import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^09\d{9}$/),
  address: z.string().min(10),
  schoolName: z.string().min(3),
  course: z.string().min(2),
  yearLevel: z.coerce.number().int().min(1).max(5),
  gwa: z.coerce.number().min(0).max(100),
});

function generateApplicationId(): string {
  return `SPC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const apps = await db.select().from(applications).where(sql`${applications.email} = ${email}`);
  return NextResponse.json(apps);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const email = data.email;

  await db.update(applications).set({
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    address: data.address,
    schoolName: data.schoolName,
    course: data.course,
    yearLevel: data.yearLevel,
    gwa: String(data.gwa),
    updatedAt: new Date(),
  }).where(eq(applications.email, email));

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const body = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  await db.update(applications).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(applications.email, email));

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const applicationId = generateApplicationId();

  await db.insert(applications).values({
    applicationId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    schoolName: data.schoolName,
    course: data.course,
    yearLevel: data.yearLevel,
    gwa: String(data.gwa),
  });

  return NextResponse.json({ applicationId }, { status: 201 });
}
