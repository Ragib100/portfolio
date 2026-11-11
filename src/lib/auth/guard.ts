import { checkOrigin } from "@/lib/site_origin/checkOrigin";
import { requireAdminSession } from "./session";

export async function guard() {
  await checkOrigin();
  await requireAdminSession();
}