import { type Timestamp } from "firebase-admin/firestore";

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