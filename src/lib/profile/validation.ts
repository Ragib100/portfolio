import { profileSchema } from "./schema";
import type { ProfileData } from "@/lib/data/profile";

const BD_COUNTRY_CODE = "880";

const BD_MOBILE_PREFIXES = [
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
];

function normalizeBangladeshPhone(rawPhone: string): string | null {
  const phone = rawPhone.trim();

  if (phone === "") return null;

  let nationalNumber: string;

  if (phone.startsWith("+")) {
    if (!phone.startsWith(`+${BD_COUNTRY_CODE}`)) {
      throw new Error("Only Bangladesh phone numbers are accepted.");
    }

    nationalNumber = phone.slice(BD_COUNTRY_CODE.length + 1);
  } else if (phone.startsWith(BD_COUNTRY_CODE)) {
    nationalNumber = phone.slice(BD_COUNTRY_CODE.length);
  } else {
    nationalNumber = phone;
  }

  if (nationalNumber.startsWith("0")) {
    nationalNumber = nationalNumber.slice(1);
  }

  if (!/^\d{10}$/.test(nationalNumber)) {
    throw new Error("Enter a valid 10-digit Bangladesh mobile number.");
  }

  const prefix = nationalNumber.slice(0, 2);

  if (!BD_MOBILE_PREFIXES.includes(prefix)) {
    throw new Error("Enter a valid Bangladesh mobile number.");
  }

  return `+${BD_COUNTRY_CODE}${nationalNumber}`;
}

export function validateProfile(input: ProfileData): ProfileData {
  const parsed = profileSchema.parse(input);

  return {
    ...parsed,
    phone:
      parsed.phone === null
        ? null
        : normalizeBangladeshPhone(parsed.phone),
  };
}