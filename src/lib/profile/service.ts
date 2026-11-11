import "server-only";

import type { ProfileData } from "@/lib/data/profile";
import { validateProfile } from "./validation";
import {
  getProfile as getProfileFromRepository,
  saveProfile as saveProfileToRepository,
} from "./repository";

export async function getProfile(): Promise<ProfileData | null> {
  return getProfileFromRepository();
}

export async function saveProfile(input: ProfileData): Promise<void> {
  const profile: ProfileData = validateProfile(input);

  await saveProfileToRepository(profile);
}