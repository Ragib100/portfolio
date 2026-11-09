"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { type ContactLink } from "@/lib/data/contact";
import { getOrigin } from "@/lib/site_origin/getOrigin";
import { getContactLinks as getContactLinksFromService, saveContactLinks as saveContactLinksToService} from "@/lib/contact/service";

const linkSchema = z.object({
  id: z.string().min(1).max(100),
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(2048),
  visible: z.boolean(),
});

const additionSchema = z.object({
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(2048),
});

// Exported from a "use server" file = publicly callable, so it must check admin.
export async function getContactLinks(): Promise<ContactLink[]> {
  await requireAdminSession();
  return getContactLinksFromService();
}

export async function saveContactSet(formData: FormData) {
  await requireAdminSession();
  await saveContactLinksToService(formData);

  revalidateTag("contact", "max");
  revalidatePath("/admin/contact");
  redirect("/admin/contact"); // outside try/catch: redirect() works by throwing
}