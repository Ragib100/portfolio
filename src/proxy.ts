import { NextResponse, type NextRequest } from "next/server";

// Must match the cookie name your login flow sets.
const SESSION_COOKIE = "__session_admin";

// Fast pre-check only. It does NOT verify the cookie; layout.tsx and
// requireAdminSession() still do the real verification.
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasCookie = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/admin/login") {
    // ?invalid=1 is set by the layout when a cookie exists but failed
    // verification. Let it through, or the two redirects would loop forever.
    if (hasCookie && !searchParams.has("invalid")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

// "/" and every other non-admin path never reach the proxy.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};