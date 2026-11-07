"use server";

import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth/session";
import { uploadProfileImage } from "@/lib/cloudinary/profile-image";
import type { ProfileInput, SerializedProfile } from "@/lib/data/profile";
import {
  getProfile as getProfileFromService,
  saveProfile as saveProfileToService,
} from "@/lib/profile/service";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Uploads a new image if one was chosen, otherwise keeps the current one. */
async function resolveImageUrl(formData: FormData): Promise<string | null> {
  const currentProfile = await getProfileFromService();
  const currentUrl = currentProfile?.image ?? null;

  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return currentUrl;
  }

  if (
    !image.type.startsWith("image/") ||
    image.size > MAX_IMAGE_SIZE_BYTES
  ) {
    throw new Error("Choose an image file that is 5 MB or smaller.");
  }

  const uploaded = await uploadProfileImage(image);
  // console.log("Uploaded profile image:", uploaded);
  return uploaded.url;
}

async function buildProfileFromForm(
  formData: FormData,
): Promise<ProfileInput> {
  return {
    fullName: getText(formData, "full-name"),
    image: await resolveImageUrl(formData),
    professionalTitle: getText(formData, "professional-title"),
    tagline: getText(formData, "tagline"),
    location: getText(formData, "location"),
    phone: getText(formData, "phone") || null,
    availableForWork: formData.get("availability") === "on",
    about: getText(formData, "about"),
  };
}

/**
 * Returns the current profile for the admin page,
 * or null if no profile exists yet.
 */
export async function getProfile(): Promise<SerializedProfile | null> {
  await requireAdminSession();

  return getProfileFromService();
}

export async function saveProfile(formData: FormData): Promise<void> {
  await requireAdminSession();

  const profile = await buildProfileFromForm(formData);

  await saveProfileToService(profile);

  redirect("/admin/profile");
}