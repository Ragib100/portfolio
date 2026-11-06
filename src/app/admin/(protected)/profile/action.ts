"use server";

import { redirect } from "next/navigation";

import { getOrigin } from "@/lib/site_origin/getOrigin";
import { requireAdminSession } from "@/lib/auth/session";
import { uploadProfileImage } from "@/lib/cloudinary/profile-image";
import {
  getProfile as getStoredProfile,
  serializeProfile,
  type ProfileInput,
  type SerializedProfile,
} from "@/lib/data/profile";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const BD_COUNTRY_CODE = "880";

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/** Uploads a new image if one was chosen, otherwise keeps the current one. */
async function resolveImageUrl(formData: FormData) {
  const currentProfile = await getStoredProfile();
  const currentUrl = currentProfile?.image ?? null;

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return currentUrl;
  }

  if (!image.type.startsWith("image/") || image.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Choose an image file that is 5 MB or smaller.");
  }

  const uploaded = await uploadProfileImage(image);
  return uploaded.url;
}

/** Empty input becomes null; otherwise the digits are prefixed with the country code. */
function parsePhone(rawPhone: string) {
  if (rawPhone === "") return null;

  if (!/^\d+$/.test(rawPhone)) {
    throw new Error("Phone number can only contain digits.");
  }

  return Number(`${BD_COUNTRY_CODE}${rawPhone}`);
}

async function buildProfileFromForm(formData: FormData): Promise<ProfileInput> {
  return {
    fullName: getText(formData, "full-name"),
    image: await resolveImageUrl(formData),
    professionalTitle: getText(formData, "professional-title"),
    tagline: getText(formData, "tagline"),
    location: getText(formData, "location"),
    phone: parsePhone(getText(formData, "phone")),
    availableForWork: formData.get("availability") === "on",
    about: getText(formData, "about"),
  };
}

/**
 * Returns the current profile for the admin page, or null if none exists yet.
 *
 * Exports from a "use server" file are public endpoints, so the admin
 * check must live here and not only in the page that calls it.
 */
export async function getProfile(): Promise<SerializedProfile | null> {
  await requireAdminSession();

  const profile = await getStoredProfile();
  return profile ? serializeProfile(profile) : null;
}

export async function saveProfile(formData: FormData) {
  await requireAdminSession();

  const { origin, cookie } = await getOrigin();
  const profile = await buildProfileFromForm(formData);

  const response = await fetch(new URL("/api/admin/profile", origin), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie,
      origin,
    },
    body: JSON.stringify(profile),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to save profile. Please try again.");
  }

  redirect("/admin/profile");
}