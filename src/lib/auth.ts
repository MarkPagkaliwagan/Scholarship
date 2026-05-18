import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function resolveServerAuthBaseURL() {
  const configuredURL =
    process.env.BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredURL) {
    return undefined;
  }

  try {
    const url = new URL(configuredURL);
    const isLocalAuthHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (process.env.NODE_ENV === "production" && isLocalAuthHost) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  return configuredURL;
}

function getTrustedOrigins() {
  return [
    "http://localhost:3000",
    "http://localhost:5001",
    "https://scholarship.igat.com.ph",
    "https://scholarship-spc.igat.com.ph",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ].filter((origin): origin is string => Boolean(origin));
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: `Iskolar ng San Pablo <${process.env.RESEND_FROM_EMAIL}>`,
        to: [user.email],
        subject: "Reset Your Password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
            <h2 style="color:#1a3c2e;margin-bottom:8px">Reset Your Password</h2>
            <p style="color:#6b7280;margin-bottom:24px">
              We received a request to reset your Iskolar ng San Pablo account password.
              Click the button below to set a new one.
            </p>
            <a href="${url}"
               style="display:inline-block;background:#1a3c2e;color:white;padding:14px 32px;
                      border-radius:10px;text-decoration:none;font-weight:600;margin-bottom:24px">
              Reset Password
            </a>
            <p style="color:#9ca3af;font-size:13px">
              This link expires in 1 hour. If you did not request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("[auth] sendResetPassword error:", error);
      }
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
  baseURL: resolveServerAuthBaseURL(),
  trustedOrigins: getTrustedOrigins(),
});
