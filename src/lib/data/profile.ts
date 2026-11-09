import { type Timestamp } from "firebase-admin/firestore";

export type ProfileInput = {
  fullName: string;
  image: string | null;
  professionalTitle: string;
  tagline: string;
  location: string;
  phone: string | null;
  availableForWork: boolean;
  about: string;
};

export type ProfileData = ProfileInput & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SerializedProfile = ProfileInput & {
  createdAt: string | null;
  updatedAt: string | null;
};