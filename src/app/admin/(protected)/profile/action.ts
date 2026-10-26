"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/data/profile";
import { uploadProfileImage } from "@/lib/cloudinary/profile-image";

export async function saveProfile(formData: FormData) {
  await requireAdminSession();

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  if (!host || (protocol !== "http" && protocol !== "https")) {
    throw new Error("Unable to determine the site address to save your profile.");
  }

  const origin = `${protocol}://${host}`;
  const forwardedHeaders = {
    cookie: requestHeaders.get("cookie") ?? "",
    origin,
  };
  const currentProfile = await getProfile();
  const existingImageUrl = currentProfile?.image ?? null;

  const image = formData.get("image");
  let imageUrl = existingImageUrl;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) {
      throw new Error("Choose an image file that is 5 MB or smaller.");
    }

    const uploaded = await uploadProfileImage(image);
    imageUrl = uploaded.url;
  }

  const profile = {
    fullName: String(formData.get("full-name") ?? "").trim(),
    image: imageUrl,
    professionalTitle: String(formData.get("professional-title") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    availableForWork: formData.get("availability") === "on",
    about: String(formData.get("about") ?? "").trim(),
  };

  const response = await fetch(new URL("/api/admin/profile", origin), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...forwardedHeaders,
    },
    body: JSON.stringify(profile),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to save profile. Please try again.");
  }

  redirect("/admin/profile");
}
