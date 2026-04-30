import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

function resolveServerAuthBaseURL() {
  const configuredURL = process.env.BETTER_AUTH_URL?.trim();

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

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  baseURL: resolveServerAuthBaseURL(),
});
