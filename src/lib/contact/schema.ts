import { z } from "zod";

export const contactLinkSchema = z
  .object({
    id: z.string().min(1).max(100),
    label: z.string().trim().min(1).max(80),
    value: z.string().trim().min(1).max(2048),
    visible: z.boolean(),
  })
  .strict();

export const contactLinksSchema = z
  .array(contactLinkSchema)
  .max(100)
  .superRefine((links, context) => {
    if (new Set(links.map((link) => link.id)).size !== links.length) {
      context.addIssue({
        code: "custom",
        message: "Contact link IDs must be unique.",
      });
    }
  });

export const contactAdditionSchema = z
  .object({
    label: z.string().trim().min(1).max(80),
    value: z.string().trim().min(1).max(2048),
  })
  .strict();

export type ContactLinksSchemaInput = z.input<typeof contactLinksSchema>;

export type ValidatedContactLinks = z.output<typeof contactLinksSchema>;

export type ValidatedContactAddition = z.output<typeof contactAdditionSchema>;
