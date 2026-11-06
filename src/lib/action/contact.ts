import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { type ContactLink } from "@/lib/data/contact";

const CONTACT_DOC_PATH = "site/contact";

export async function getContactLinks(): Promise<ContactLink[]> {
  const snapshot = await getFirebaseAdminFirestore().doc(CONTACT_DOC_PATH).get();
  if (!snapshot.exists || !Array.isArray(snapshot.data()?.links)) return [];
  return snapshot.data()!.links as ContactLink[];
}

export async function saveContactLinks(links: ContactLink[]) {
  await getFirebaseAdminFirestore().doc(CONTACT_DOC_PATH).set(
    { links, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
}
