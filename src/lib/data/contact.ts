import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export type ContactLink = {
  id: string;
  label: string;
  value: string;
  visible: boolean;
};

const initialLinks: ContactLink[] = [
  { id: "email", label: "Email", value: "hello@example.com", visible: true },
  { id: "linkedin", label: "LinkedIn", value: "https://linkedin.com/in/ragib-hasan", visible: true },
  { id: "github", label: "GitHub", value: "https://github.com/Ragib100", visible: true },
  { id: "facebook", label: "Facebook", value: "https://facebook.com/ragib.hasan", visible: true },
  { id: "codeforces", label: "Codeforces", value: "https://codeforces.com/profile/Ragib100", visible: true },
];

export async function getContactLinks(): Promise<ContactLink[]> {
  const snapshot = await getFirebaseAdminFirestore().doc("site/contact").get();
  if (!snapshot.exists || !Array.isArray(snapshot.data()?.links)) return initialLinks;
  return snapshot.data()!.links as ContactLink[];
}

export async function saveContactLinks(links: ContactLink[]) {
  await getFirebaseAdminFirestore().doc("site/contact").set(
    { links, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
}
