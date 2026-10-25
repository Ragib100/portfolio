import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmails, getSessionCookieName, isAllowedAdmin, SESSION_DURATION_SECONDS } from "@/lib/auth/config";
import { isAuthRateLimited } from "@/lib/auth/rate-limit";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const sessionRequestSchema = z.object({ idToken: z.string().min(1).max(10_000) }).strict();

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function rateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || "unknown";
  return createHash("sha256").update(address).digest("hex");
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  if (isAuthRateLimited(rateLimitKey(request))) {
    return NextResponse.json({ error: "Too many sign-in attempts. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = sessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifyIdToken(parsed.data.idToken, true);

    // Fail closed when deployment configuration accidentally omits the owner allowlist.
    if (getAdminEmails().size === 0) {
      return NextResponse.json({ error: "Admin sign-in is not configured." }, { status: 503 });
    }

    if (!decodedToken.email_verified || !isAllowedAdmin(decodedToken.email)) {
      return NextResponse.json({ error: "This Google account is not authorized." }, { status: 403 });
    }

    const sessionCookie = await auth.createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_DURATION_SECONDS * 1000,
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getSessionCookieName(), sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in. Check your configuration and try again." }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
