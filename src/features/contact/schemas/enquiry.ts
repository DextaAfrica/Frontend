import { z } from "zod";

/**
 * Sanitizes user input by stripping null bytes, ASCII control codes,
 * and dangerous HTML/script injection attempts.
 */
function sanitizeInput(val: string): string {
  return val
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip null & control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Strip <script> blocks
    .replace(/<[^>]+>/g, "") // Strip raw HTML tags
    .trim();
}

const sanitizedText = (label: string, minLen: number, maxLen: number) =>
  z
    .string()
    .transform(sanitizeInput)
    .refine((v) => v.length >= minLen, {
      message: `${label} is required.`,
    })
    .refine((v) => v.length <= maxLen, {
      message: `${label} cannot exceed ${maxLen} characters.`,
    });

// International telephone number format (E.164 compliant with standard delimiters)
const phoneRegex = /^\+?[0-9\s\-().]{7,30}$/;

export const enquirySchema = z
  .object({
    firstName: sanitizedText("First name", 1, 80),
    lastName: sanitizedText("Last name", 1, 80),
    email: z
      .string()
      .transform(sanitizeInput)
      .transform((e) => e.toLowerCase())
      .refine((e) => e.length <= 254, "Email address is too long.")
      .refine(
        (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e),
        "Enter a valid email address.",
      ),
    phone: z
      .string()
      .transform(sanitizeInput)
      .refine((p) => p.length >= 7, "Phone number is required.")
      .refine(
        (p) => p.length <= 40,
        "Phone number cannot exceed 40 characters.",
      )
      .refine(
        (p) => phoneRegex.test(p),
        "Enter a valid international phone number.",
      ),
    interest: z.enum([
      "Purchasing a residence",
      "Investment opportunity",
      "Partnership",
      "General enquiry",
    ]),
    message: sanitizedText("Message", 1, 3000),
    consent: z.literal(true),
    // Honeypot field: real users leave this empty; spam bots fill it in
    company: z.string().max(200).optional().default(""),
  })
  .strict();
