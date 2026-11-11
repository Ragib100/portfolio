import { z } from "zod";
import type { Contest, ContestFormState, ContestInput } from "@/lib/data/contest";
import { contestSchema } from "./schema";

const FORM_KEYS = [
  "title", "category", "date", "rank", "totalParticipants", "solved",
  "totalProblems", "teamName", "url", "notes",
] as const;

export function parseContestForm(formData: FormData):
  | { ok: true; data: ContestInput }
  | { ok: false; values: Record<string, string>; fieldErrors: ContestFormState["fieldErrors"] } {
  const values: Record<string, string> = {};
  for (const key of FORM_KEYS) {
    const raw = formData.get(key);
    values[key] = typeof raw === "string" ? raw : "";
  }
  values.published = formData.get("published") === "on" ? "on" : "";

  const result = contestSchema.safeParse({ ...values, published: values.published === "on" });
  if (!result.success) {
    return {
      ok: false,
      values,
      fieldErrors: z.flattenError(result.error).fieldErrors as ContestFormState["fieldErrors"],
    };
  }
  return { ok: true, data: result.data };
}

export function toFormValues(contest?: Contest): Record<string, string> {
  return {
    title: contest?.title ?? "",
    category: contest?.category ?? "",
    date: contest?.date ?? "",
    rank: contest?.rank?.toString() ?? "",
    totalParticipants: contest?.totalParticipants?.toString() ?? "",
    solved: contest?.solved?.toString() ?? "",
    totalProblems: contest?.totalProblems?.toString() ?? "",
    teamName: contest?.teamName ?? "",
    url: contest?.url ?? "",
    notes: contest?.notes ?? "",
    published: contest?.published ? "on" : "",
  };
}

export function formatContestDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
