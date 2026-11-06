import "server-only";

import { FieldValue, type Timestamp } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const PROFILE_DOC_PATH = "site/profile";

/** Fields the admin can edit. */
export type ProfileInput = {
  fullName: string;
  image: string | null;
  professionalTitle: string;
  tagline: string;
  location: string;
  phone: number | null;
  availableForWork: boolean;
  about: string;
};

/** Shape stored in Firestore. */
export type ProfileData = ProfileInput & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/** JSON-safe shape returned by the API. */
export type SerializedProfile = ProfileInput & {
  createdAt: string | null;
  updatedAt: string | null;
};

function getProfileRef() {
  return getFirebaseAdminFirestore().doc(PROFILE_DOC_PATH);
}

export async function getProfile(): Promise<ProfileData | null> {
  const snapshot = await getProfileRef().get();
  return snapshot.exists ? (snapshot.data() as ProfileData) : null;
}

/** Converts Firestore Timestamps to ISO strings so the profile can be sent as JSON. */
export function serializeProfile(profile: ProfileData): SerializedProfile {
  const { createdAt, updatedAt, ...fields } = profile;

  return {
    ...fields,
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