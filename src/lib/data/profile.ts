import { type Timestamp } from "firebase-admin/firestore";

export type ProfileData = {
  fullName: string;
  image: string | null;
  professionalTitle: string;
  tagline: string;
  location: string;
  phone: string | null;
  availableForWork: boolean;
  about: string;
};