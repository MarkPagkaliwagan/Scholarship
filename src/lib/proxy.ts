import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function authGuard(request: NextRequest): Promise<NextResponse | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "1");
    return NextResponse.redirect(url);
  }
  return null;
}
