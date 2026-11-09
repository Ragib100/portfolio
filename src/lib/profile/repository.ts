import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import type {
  ProfileInput,
  ProfileData,
  SerializedProfile,
} from "@/lib/data/profile";

const PROFILE_DOC_PATH = "site/profile";

function getProfileRef() {
  return getFirebaseAdminFirestore().doc(PROFILE_DOC_PATH);
}

export async function getProfile(): Promise<SerializedProfile | null> {
  const profileDoc = await getProfileRef().get();

  if (!profileDoc.exists) {
    return null;
  }

  const {
    createdAt,
    updatedAt,
    ...profileData
  } = profileDoc.data() as ProfileData;

  return {
    ...profileData,
    createdAt: createdAt?.toDate().toISOString() ?? null,
    updatedAt: updatedAt?.toDate().toISOString() ?? null,
  };
}

export async function saveProfile(profile: ProfileInput): Promise<void> {
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