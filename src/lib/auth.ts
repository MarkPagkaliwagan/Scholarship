import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

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
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ].filter((origin): origin is string => Boolean(origin));
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  baseURL: resolveServerAuthBaseURL(),
  trustedOrigins: getTrustedOrigins(),
});
