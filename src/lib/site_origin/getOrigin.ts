import "server-only";
import { headers } from "next/headers";
import { HttpError } from "@/lib/http-error";

// Only needed if you call your own API routes with fetch().
export async function getOrigin() {
  const h = await headers();

  let origin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : null;

  if (!origin) {
    // fallback (mainly local dev)
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const protocol = h.get("x-forwarded-proto") ?? "http";
    if (!host || (protocol !== "http" && protocol !== "https")) {
      throw new HttpError(500, "Unable to determine the site address.");
    }
    origin = `${protocol}://${host}`;
  }

  return { origin, cookie: h.get("cookie") ?? "" };
}