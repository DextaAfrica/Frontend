import { z } from "zod";

/**
 * The chat widget's mini message form. Deliberately looser than
 * `enquirySchema` — one name field, one "email or phone" field, one message —
 * so someone can fire off a quick question without filling the full contact
 * form.
 */
export const chatLeadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(120),
    contact: z
      .string()
      .trim()
      .min(1, "An email or phone number is required.")
      .max(160),
    message: z.string().trim().min(1, "Message is required.").max(2000),
    // Honeypot: real visitors never fill this.
    company: z.string().max(200).optional().default(""),
  })
  .strict();

export type ChatLead = z.infer<typeof chatLeadSchema>;
