import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import type { ContactLink } from "@/lib/data/contact";

const CONTACT_DOC_PATH = "site/contact";

function getContactRef() {
  return getFirebaseAdminFirestore().doc(CONTACT_DOC_PATH);
}

export async function getContactLinks(): Promise<ContactLink[]> {
  const contactDoc = await getContactRef().get();

  if (!contactDoc.exists) {
    return [];
  }

  const links = contactDoc.data()?.links;

  if (!Array.isArray(links)) {
    return [];
  }

  return links as ContactLink[];
}

export async function saveContactLinks(links: ContactLink[]): Promise<void> {
  await getContactRef().set(
    {
      links,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}
