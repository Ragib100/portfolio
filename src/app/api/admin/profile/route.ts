import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { getProfile, saveProfile } from "@/lib/data/profile";

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

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    return NextResponse.json({
      profile: await getProfile(),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load profile. Try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }

  try {
    await saveProfile(parsed.data);

    revalidateTag("profile", "max");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save profile. Try again." },
      { status: 500 },
    );
  }
}
