"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { type ContactLink } from "@/lib/data/contact";
import { getOrigin } from "@/lib/site_origin/getOrigin";

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
  const { origin, cookie } = await getOrigin();
  const response = await fetch(new URL("/api/contact", origin), {
    headers: { cookie },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch contact links.");
  }
  const data = await response.json();
  return data as ContactLink[];
}

export async function saveContactSet(formData: FormData) {
  await requireAdminSession();

  const ids = formData.getAll("id").map(String);
  const labels = formData.getAll("label").map(String);
  const values = formData.getAll("value").map(String);
  const visibleIds = new Set(formData.getAll("visible").map(String));

  if (ids.length !== labels.length || ids.length !== values.length || ids.length > 100) {
    throw new Error("Invalid contact links.");
  }

  const links = z.array(linkSchema).safeParse(
    ids.map((id, index) => ({
      id,
      label: labels[index],
      value: values[index],
      visible: visibleIds.has(id),
    })),
  );
  if (!links.success || new Set(links.data.map((link) => link.id)).size !== links.data.length) {
    throw new Error("Check the contact links and try again.");
  }

  const removedIds = new Set(formData.getAll("remove").map(String));
  const updatedLinks = links.data.filter((link) => !removedIds.has(link.id));

  const newLabels = formData.getAll("newLabel").map((v) => String(v).trim());
  const newValues = formData.getAll("newValue").map((v) => String(v).trim());
  if (newLabels.length !== newValues.length) throw new Error("Invalid new contact links.");

  const additions: Array<z.infer<typeof additionSchema>> = [];
  for (let index = 0; index < newLabels.length; index++) {
    const label = newLabels[index];
    const value = newValues[index];
    if (!label && !value) continue;
    if (!label || !value) throw new Error("Fill in both fields for each new link.");

    const addition = additionSchema.safeParse({ label, value });
    if (!addition.success) throw new Error("Enter a valid new link.");
    additions.push(addition.data);
  }

  if (updatedLinks.length + additions.length > 100) {
    throw new Error("You can save up to 100 contact links.");
  }
  updatedLinks.push(
    ...additions.map((addition) => ({
      id: crypto.randomUUID(),
      ...addition,
      visible: true,
    })),
  );

  const { origin, cookie } = await getOrigin();
  try {
    const response = await fetch(new URL("/api/contact", origin), {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie,
        origin,
      },
      body: JSON.stringify(updatedLinks),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Unable to save contact links. Please try again.");
    }
  } catch {
    throw new Error("Unable to save contact links. Please try again.");
  }

  revalidateTag("contact", "max");
  revalidatePath("/admin/contact");
  redirect("/admin/contact"); // outside try/catch: redirect() works by throwing
}