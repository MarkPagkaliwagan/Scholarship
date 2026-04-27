import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
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
