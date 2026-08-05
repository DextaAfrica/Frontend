import { z } from "zod";

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required.`).max(max);

export const enquirySchema = z
  .object({
    firstName: requiredText("First name", 80),
    lastName: requiredText("Last name", 80),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .email("Enter a valid email address."),
    phone: requiredText("Phone number", 40),
    interest: z.enum([
      "Purchasing a residence",
      "Investment opportunity",
      "Partnership",
      "General enquiry",
    ]),
    message: requiredText("Message", 3000),
    consent: z.literal(true),
    company: z.string().max(200).optional().default(""),
  })
  .strict();
