import "server-only";
import { headers } from "next/headers";
import { HttpError } from "@/lib/http-error";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function toOrigin(value: string | null | undefined) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function allowedOrigins(): Set<string> {
  const origins = new Set<string>();
  const site = toOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (site) origins.add(site);
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
  }
  return origins;
}

// Route handlers: checkOrigin(request). Server actions: checkOrigin().
export async function checkOrigin(request?: Request) {
  if (request && SAFE_METHODS.has(request.method)) return;

  const h = request ? request.headers : await headers();
  const origin = toOrigin(h.get("origin")) ?? toOrigin(h.get("referer"));

  if (!origin) throw new HttpError(403, "Request rejected: missing origin.");
  if (!allowedOrigins().has(origin)) {
    throw new HttpError(403, "Request rejected: origin not allowed.");
  }
}