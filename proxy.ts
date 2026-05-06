import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/apply", "/profile", "/account", "/tracking"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/?login=1", request.url));
  }

  const otpVerified = request.cookies.get("otp_verified")?.value;
  if (otpVerified !== sessionToken) {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/apply/:path*",
    "/profile/:path*",
    "/account/:path*",
    "/tracking/:path*",
  ],
};
