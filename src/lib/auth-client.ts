import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

function resolveAuthBaseURL() {
  const configuredURL =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (typeof window === "undefined") {
    return configuredURL || "http://localhost:5001";
  }

  const isLocalPage =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!configuredURL) {
    return "/api/auth";
  }

  try {
    const url = new URL(configuredURL);
    const isLocalAuthHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (isLocalAuthHost && !isLocalPage) {
      return "/api/auth";
    }
  } catch {
    return "/api/auth";
  }

  return configuredURL;
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
  plugins: [inferAdditionalFields<typeof auth>()],
});
