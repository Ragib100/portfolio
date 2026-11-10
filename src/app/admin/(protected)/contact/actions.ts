"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { guard } from "@/lib/auth/guard";
import { type ContactLink } from "@/lib/data/contact";
import { getContactLinks as getContactLinksFromService, saveContactLinks as saveContactLinksToService} from "@/lib/contact/service";

// Exported from a "use server" file = publicly callable, so it must check admin.
export async function getContactLinks(): Promise<ContactLink[]> {
  await guard();
  return getContactLinksFromService();
}

export async function saveContactSet(formData: FormData) {
  await guard();
  await saveContactLinksToService(formData);

  revalidateTag("contact", "max");
  revalidatePath("/admin/contact");
  redirect("/admin/contact"); // outside try/catch: redirect() works by throwing
}