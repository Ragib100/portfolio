import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { saveContactLinks } from "@/lib/data/contact";
import { checkOrigin } from "@/lib/site_origin/checkOrigin";
import { HttpError } from "@/lib/http-error";

const linksSchema = z.array(z.object({
  id: z.string().min(1).max(100),
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(2048),
  visible: z.boolean(),
})).max(100).superRefine((links, context) => {
  if (new Set(links.map((link) => link.id)).size !== links.length) {
    context.addIssue({ code: "custom", message: "Link IDs must be unique." });
  }
});

export async function PUT(request: Request) {
  try {
    await checkOrigin(request);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 403;
    return NextResponse.json({ error: "Request rejected." }, { status });
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

  const parsed = linksSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact links." }, { status: 400 });
  }

  try {
    await saveContactLinks(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save contact links." }, { status: 500 });
  }
}