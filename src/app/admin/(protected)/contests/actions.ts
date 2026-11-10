"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { guard } from "@/lib/auth/guard";
import { parseContestForm } from "@/lib/contests/validation";
import type { ContestFormState } from "@/lib/data/contest";
import {
  listContests,
  createContest,
  isValidContestId,
  removeContest,
  setContestPublished,
  updateContest,
} from "@/lib/contests/service";

function refresh() {
  revalidateTag("contests", "max");
  revalidatePath("/admin/contests");
}

export async function getContests() {
  await guard();
  return listContests();
}

export async function saveContest(
  _previous: ContestFormState,
  formData: FormData,
): Promise<ContestFormState> {
  await guard();

  const parsed = parseContestForm(formData);
  if (!parsed.ok) {
    return {
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.fieldErrors,
      values: parsed.values,
    };
  }

  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? rawId : "";
  if (id && !isValidContestId(id)) return { error: "Invalid contest." };

  try {
    if (id) {
      const updated = await updateContest(id, parsed.data);
      if (!updated) return { error: "This contest no longer exists." };
    } else {
      await createContest(parsed.data);
    }
  } catch {
    return { error: "Unable to save the contest. Please try again." };
  }

  refresh();
  redirect("/admin/contests"); // outside try/catch: redirect() works by throwing
}

export async function togglePublished(formData: FormData) {
  await guard();
  const id = formData.get("id");
  if (!isValidContestId(id)) throw new Error("Invalid contest.");

  await setContestPublished(id, formData.get("next") === "true");
  refresh();
}

export async function deleteContest(formData: FormData) {
  await guard();
  const id = formData.get("id");
  if (!isValidContestId(id)) throw new Error("Invalid contest.");

  await removeContest(id);
  refresh();
  redirect("/admin/contests");
}