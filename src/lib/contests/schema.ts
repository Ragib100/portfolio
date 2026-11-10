import { z } from "zod";
import { CONTEST_CATEGORIES } from "@/lib/data/contest";

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
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
      .refine(isRealDate, "Enter a valid date."),
    rank: optionalInt(1, 1_000_000),
    totalParticipants: optionalInt(1, 1_000_000),
    solved: optionalInt(0, 100),
    totalProblems: optionalInt(0, Number.MAX_SAFE_INTEGER),
    teamName: optionalText(80),
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
  .strict()
  .superRefine((value, context) => {
    if (value.rank && value.totalParticipants && value.rank > value.totalParticipants) {
      context.addIssue({
        code: "custom",
        path: ["rank"],
        message: "Rank can't be higher than the number of participants.",
      });
    }
    if (
      value.solved !== undefined &&
      value.totalProblems !== undefined &&
      value.solved > value.totalProblems
    ) {
      context.addIssue({
        code: "custom",
        path: ["solved"],
        message: "Solved problems can't exceed the total number of problems.",
      });
    }
  });

export type ValidatedContestInput = z.output<typeof contestSchema>;
