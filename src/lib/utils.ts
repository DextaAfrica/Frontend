export type ClassValue = string | false | null | undefined;

/** Join conditional class names without a runtime dependency. */
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}
