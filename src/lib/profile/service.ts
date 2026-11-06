import "server-only";

import type { ProfileInput, SerializedProfile } from "@/lib/data/profile";
import { validateProfile } from "./validation";
import {
  getProfile as getProfileFromRepository,
  saveProfile as saveProfileToRepository,
} from "./repository";

export async function getProfile(): Promise<SerializedProfile | null> {
  return getProfileFromRepository();
}

export async function saveProfile(input: unknown): Promise<void> {
  const profile: ProfileInput = validateProfile(input);

  await saveProfileToRepository(profile);
}