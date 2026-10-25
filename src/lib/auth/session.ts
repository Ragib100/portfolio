import "server-only";

import { cookies } from "next/headers";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { getSessionCookieName, isAllowedAdmin } from "@/lib/auth/config";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getSessionCookieName())?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
    if (!decoded.email || decoded.email_verified !== true || !isAllowedAdmin(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
