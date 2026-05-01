import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [application] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.userId, session.user.id))
    .limit(1);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const docs = await db
    .select()
    .from(documents)
    .where(eq(documents.applicationId, application.id));

  return NextResponse.json(docs);
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { documentId, status } = body;

  if (!documentId || !status) {
    return NextResponse.json({ error: "documentId and status required" }, { status: 400 });
  }

  const [application] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.userId, session.user.id))
    .limit(1);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const [doc] = await db
    .update(documents)
    .set({
      status,
      submittedAt: status === "submitted" ? new Date() : undefined,
    })
    .where(eq(documents.id, documentId))
    .returning();

  return NextResponse.json(doc);
}
