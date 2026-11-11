import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import type { ProfileData } from "@/lib/data/profile";

const PROFILE_DOC_PATH = "site/profile";

function getProfileRef() {
  return getFirebaseAdminFirestore().doc(PROFILE_DOC_PATH);
}

export async function getProfile(): Promise<ProfileData | null> {
  const profileDoc = await getProfileRef().get();

  if (!profileDoc.exists) {
    return null;
  }

  const data = profileDoc.data();

  if (!data) { return null; }

  const { createdAt, updatedAt, ...profileData } = data;
  return profileData as ProfileData;
}

export async function saveProfile(profile: ProfileData): Promise<void> {
  const firestore = getFirebaseAdminFirestore();
  const profileRef = getProfileRef();

  await firestore.runTransaction(async (transaction) => {
    const existingProfile = await transaction.get(profileRef);

    transaction.set(
      profileRef,
      {
        ...profile,
        ...(existingProfile.exists
          ? {}
          : { createdAt: FieldValue.serverTimestamp() }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}
