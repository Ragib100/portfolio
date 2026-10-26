"use server";

export async function saveProfile(formData: FormData) {
  const profile = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    image: formData.get("image"),
    professionalTitle: String(
      formData.get("professionalTitle") ?? ""
    ).trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    availableForWork: formData.get("availability") === "on",
    about: String(formData.get("about") ?? "").trim(),
  };

  // TODO: Save the profile to Firebase.
  console.log(profile);
}