import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export type ProfileData = {
  fullName: string;
  image: string | null;
  professionalTitle: string;
  tagline: string;
  location: string;
  phone: number | null;
  availableForWork: boolean;
  about: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export async function getProfile(): Promise<ProfileData | null> {
  const snapshot = await getFirebaseAdminFirestore().doc("site/profile").get();
  return snapshot.exists ? (snapshot.data() as ProfileData) : null;
}

export async function saveProfile(profile: Omit<ProfileData, "createdAt" | "updatedAt">) {
  const firestore = getFirebaseAdminFirestore();
  const profileRef = firestore.doc("site/profile");

  await firestore.runTransaction(async (transaction) => {
    const existingProfile = await transaction.get(profileRef);
    transaction.set(
      profileRef,
      {
        ...profile,
        ...(existingProfile.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}
