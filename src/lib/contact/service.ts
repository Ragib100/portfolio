import "server-only";

import type { ContactLink } from "@/lib/data/contact";

import {
  getContactLinks as getContactLinksFromRepository,
  saveContactLinks as saveContactLinksToRepository,
} from "./repository";

import { validateContactFormData } from "./validation";

export async function getContactLinks(): Promise<ContactLink[]> {
  return getContactLinksFromRepository();
}

export async function saveContactLinks(formData: FormData): Promise<void> {
  const links = validateContactFormData(formData);

  await saveContactLinksToRepository(links);
}
