import { z } from "zod";

export const newsletterSubscriptionSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .email("Enter a valid email address."),
    company: z.string().max(200).optional().default(""),
    source: z
      .enum(["landing_page", "newsletter_modal", "website"])
      .default("website"),
    consent: z
      .object({
        necessary: z.literal(true),
        analytics: z.boolean(),
        marketing: z.boolean(),
        updatedAt: z.string(),
      })
      .strict()
      .nullable()
      .optional()
      .default(null),
  })
  .strict();
