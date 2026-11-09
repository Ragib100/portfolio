import { contactLinksSchema, contactAdditionSchema } from "./schema";

import type { ValidatedContactLinks } from "./schema";

export function validateContactLinks(input: unknown): ValidatedContactLinks {
  return contactLinksSchema.parse(input);
}

export function validateContactFormData(
  formData: FormData,
): ValidatedContactLinks {
  const ids = formData.getAll("id").map(String);
  const labels = formData.getAll("label").map(String);
  const values = formData.getAll("value").map(String);

  const visibleIds = new Set(formData.getAll("visible").map(String));

  if (
    ids.length !== labels.length ||
    ids.length !== values.length ||
    ids.length > 100
  ) {
    throw new Error("Invalid contact links.");
  }

  const links = ids.map((id, index) => ({
    id,
    label: labels[index],
    value: values[index],
    visible: visibleIds.has(id),
  }));

  const parsedLinks = validateContactLinks(links);

  const removedIds = new Set(formData.getAll("remove").map(String));

  const updatedLinks = parsedLinks.filter((link) => !removedIds.has(link.id));

  const newLabels = formData
    .getAll("newLabel")
    .map((value) => String(value).trim());

  const newValues = formData
    .getAll("newValue")
    .map((value) => String(value).trim());

  if (newLabels.length !== newValues.length) {
    throw new Error("Invalid new contact links.");
  }

  const additions = [];

  for (let index = 0; index < newLabels.length; index++) {
    const label = newLabels[index];
    const value = newValues[index];

    if (!label && !value) continue;

    if (!label || !value) {
      throw new Error("Fill in both fields for each new link.");
    }

    const parsed = contactAdditionSchema.safeParse({
      label,
      value,
    });

    if (!parsed.success) {
      throw new Error("Enter a valid new link.");
    }

    additions.push(parsed.data);
  }

  if (updatedLinks.length + additions.length > 100) {
    throw new Error("You can save up to 100 contact links.");
  }

  const newLinks = additions.map((addition) => ({
    id: crypto.randomUUID(),
    ...addition,
    visible: true,
  }));

  return validateContactLinks([...updatedLinks, ...newLinks]);
}
