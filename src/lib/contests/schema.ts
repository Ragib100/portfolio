import { z } from "zod";

// No "server-only" here: the client form imports types and constants from this file.

export const CONTEST_CATEGORIES = ["ICPC", "IUPC", "National", "Hackathon", "Online", "Other"] as const;
export const CONTEST_MODES = ["Onsite", "Online", "Hybrid"] as const;

const blank = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalText = (max: number) =>
  z.preprocess(blank, z.string().trim().max(max, `Keep this under ${max} characters.`).optional());

const optionalInt = (min: number, max: number) =>
  z.preprocess(
    blank,
    z.coerce
      .number({ error: "Enter a whole number." })
      .int("Enter a whole number.")
      .min(min, `Must be at least ${min}.`)
      .max(max, `Must be at most ${max}.`)
      .optional(),
  );

function isRealDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const contestSchema = z
  .object({
    title: z.string().trim().min(1, "Enter the contest name.").max(120, "Keep this under 120 characters."),
    category: z.enum(CONTEST_CATEGORIES, { error: "Choose a category." }),
    organizer: optionalText(120),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
      .refine(isRealDate, "Enter a valid date."),
    mode: z.enum(CONTEST_MODES, { error: "Choose a mode." }),
    rank: optionalInt(1, 1_000_000),
    totalParticipants: optionalInt(1, 1_000_000),
    teamName: optionalText(80),
    solved: optionalInt(0, 100),
    prize: optionalText(120),
    url: z.preprocess(
      blank,
      z
        .string()
        .trim()
        .max(2048, "Keep this under 2048 characters.")
        .refine(isHttpUrl, "Enter a link starting with http:// or https://")
        .optional(),
    ),
    notes: optionalText(1000),
    published: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.rank && value.totalParticipants && value.rank > value.totalParticipants) {
      context.addIssue({
        code: "custom",
        path: ["rank"],
        message: "Rank can't be higher than the number of participants.",
      });
    }
  });

export type ContestInput = z.infer<typeof contestSchema>;

export type Contest = ContestInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ContestFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

const FORM_KEYS = [
  "title", "category", "organizer", "date", "mode", "rank",
  "totalParticipants", "teamName", "solved", "prize", "url", "notes",
] as const;

export function parseContestForm(formData: FormData) {
  const values: Record<string, string> = {};
  for (const key of FORM_KEYS) {
    const raw = formData.get(key);
    values[key] = typeof raw === "string" ? raw : "";
  }
  values.published = formData.get("published") === "on" ? "on" : "";

  const result = contestSchema.safeParse({ ...values, published: values.published === "on" });
  if (!result.success) {
    return {
      ok: false as const,
      values,
      fieldErrors: z.flattenError(result.error).fieldErrors as Record<string, string[] | undefined>,
    };
  }
  return { ok: true as const, data: result.data };
}

// Values used to fill the form (existing contest, or empty for a new one).
export function toFormValues(contest?: Contest): Record<string, string> {
  return {
    title: contest?.title ?? "",
    category: contest?.category ?? "",
    organizer: contest?.organizer ?? "",
    date: contest?.date ?? "",
    mode: contest?.mode ?? "Onsite",
    rank: contest?.rank?.toString() ?? "",
    totalParticipants: contest?.totalParticipants?.toString() ?? "",
    teamName: contest?.teamName ?? "",
    solved: contest?.solved?.toString() ?? "",
    prize: contest?.prize ?? "",
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