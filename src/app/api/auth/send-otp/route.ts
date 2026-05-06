import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db
    .delete(verification)
    .where(eq(verification.identifier, `otp:${email}`));

  await db.insert(verification).values({
    id: crypto.randomUUID(),
    identifier: `otp:${email}`,
    value: otp,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const { error } = await resend.emails.send({
    from: `Iskolar ng San Pablo <${process.env.RESEND_FROM_EMAIL}>`,
    to: [email],
    subject: "Your Login Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="color:#1a3c2e;margin-bottom:8px">Verification Code</h2>
        <p style="color:#6b7280;margin-bottom:24px">Enter this code to complete your sign-in to Iskolar ng San Pablo.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#1a3c2e">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:13px">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[send-otp] Resend error:", error);
    return NextResponse.json({ error: "Failed to send OTP", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
