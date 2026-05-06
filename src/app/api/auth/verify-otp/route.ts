import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { verification } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { otp } = await req.json();
  if (!otp || typeof otp !== "string") {
    return NextResponse.json({ error: "OTP required" }, { status: 400 });
  }

  const email = session.user.email;
  const identifier = `otp:${email}`;

  const [record] = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, identifier))
    .limit(1);

  if (!record) {
    return NextResponse.json({ error: "No OTP found. Request a new one." }, { status: 400 });
  }

  if (new Date() > record.expiresAt) {
    await db.delete(verification).where(eq(verification.identifier, identifier));
    return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 400 });
  }

  if (record.value !== otp.trim()) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
  }

  await db.delete(verification).where(eq(verification.identifier, identifier));

  const sessionToken = req.cookies.get("better-auth.session_token")?.value ?? "";

  const response = NextResponse.json({ ok: true });
  response.cookies.set("otp_verified", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
