export type ClassValue = string | false | null | undefined;

/** Join conditional class names without a runtime dependency. */
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

/** Turns a heading like "Scope and consent" into "scope-and-consent" for use as an anchor id. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
