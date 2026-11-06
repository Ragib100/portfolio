"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/session";
import { checkOrigin } from "@/lib/site_origin/checkOrigin";
import { parseContestForm, type ContestFormState } from "@/lib/contests/schema";
import {
  createContest,
  isValidContestId,
  removeContest,
  setContestPublished,
  updateContest,
} from "@/lib/data/contests";

// Every exported function here is a public endpoint, so each one checks origin + admin.
async function guard() {
  await checkOrigin();
  await requireAdminSession();
}

function refresh() {
  revalidateTag("contests", "max");
  revalidatePath("/admin/contests");
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