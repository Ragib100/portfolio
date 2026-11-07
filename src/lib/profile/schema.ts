import { z } from "zod";

export const profileSchema = z
  .object({
    fullName: z.string().trim().max(120),
    image: z.string().url().max(2048).nullable(),
    professionalTitle: z.string().trim().max(160),
    tagline: z.string().trim().max(300),
    location: z.string().trim().max(160),
    phone: z.string().nullable(),
    availableForWork: z.boolean(),
    about: z.string().trim().max(10_000),
  })
  .strict();

export type ProfileSchemaInput = z.input<typeof profileSchema>;
export type ValidatedProfile = z.output<typeof profileSchema>;