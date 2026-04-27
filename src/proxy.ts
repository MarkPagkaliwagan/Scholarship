import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/lib/proxy";

export async function proxy(request: NextRequest) {
  return (await authGuard(request)) ?? NextResponse.next();
}


export const config = {
  matcher: ["/apply/:path*"],
};
