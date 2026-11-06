import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

import {
  type ProfileInput,
  type ProfileData,
  type SerializedProfile,
} from "@/lib/data/profile";

const PROFILE_DOC_PATH = "site/profile";

function getProfileRef() {
  return getFirebaseAdminFirestore().doc(PROFILE_DOC_PATH);
}

export async function getProfile(): Promise<SerializedProfile> {
  const profile_doc = await getProfileRef().get();
  const { createdAt, updatedAt, ...profile_data } =
    profile_doc.data() as ProfileData;

  return {
    ...profile_data,
    createdAt: createdAt?.toDate().toISOString() ?? null,
    updatedAt: updatedAt?.toDate().toISOString() ?? null,
  };
}

export async function saveProfile(profile: ProfileInput) {
  const firestore = getFirebaseAdminFirestore();
  const profileRef = getProfileRef();

  await firestore.runTransaction(async (transaction) => {
    const existing = await transaction.get(profileRef);

    transaction.set(
      profileRef,
      {
        ...profile,
        // Only set createdAt the first time the profile is saved.
        ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}
