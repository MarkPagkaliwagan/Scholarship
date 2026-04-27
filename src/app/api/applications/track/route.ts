import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const [row] = await db
    .select({
      applicationId: applications.applicationId,
      firstName: applications.firstName,
      lastName: applications.lastName,
      status: applications.status,
      remarks: applications.remarks,
      submittedAt: applications.submittedAt,
    })
    .from(applications)
    .where(eq(applications.applicationId, id.toUpperCase()))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}
