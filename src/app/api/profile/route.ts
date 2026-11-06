import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { checkOrigin } from "@/lib/site_origin/checkOrigin";
import { getProfile, saveProfile } from "@/lib/action/profile";
import { HttpError } from "@/lib/http-error";

const profileSchema = z
  .object({
    fullName: z.string().trim().max(120),
    image: z.string().url().max(2048).nullable(),
    professionalTitle: z.string().trim().max(160),
    tagline: z.string().trim().max(300),
    location: z.string().trim().max(160),
    phone: z.number().int().nonnegative().safe().nullable(),
    availableForWork: z.boolean(),
    about: z.string().trim().max(10_000),
  })
  .strict();

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    await checkOrigin();
  }
  catch (error) {
    const status = error instanceof HttpError ? error.status : 403;
    return NextResponse.json({ error: "Request rejected." }, { status });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const profile = await getProfile();
    if (!profile) {
      return errorResponse("Profile not found.", 404);
    }

    return NextResponse.json(profile, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return errorResponse("Unable to load profile. Try again.", 500);
  }
}

export async function POST(request: Request) {
  try {
    await checkOrigin(request);
  }
  catch (error) {
    const status = error instanceof HttpError ? error.status : 403;
    return NextResponse.json({ error: "Request rejected." }, { status });
  }

  try {
    await requireAdminSession();
  }
  catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid profile data.", 400);
  }

  try {
    await saveProfile(parsed.data);
    revalidateTag("profile", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return errorResponse("Unable to save profile. Try again.", 500);
  }
}