import { describe, expect, it } from "vitest";
import { chatLeadSchema } from "./chat-lead";

const validLead = {
  name: "Ada Okafor",
  contact: "ada@example.com",
  message: "Do you have plots available in Ijebu-Ode?",
};

describe("chatLeadSchema", () => {
  it("accepts a minimal message and defaults the honeypot", () => {
    const lead = chatLeadSchema.parse(validLead);
    expect(lead.company).toBe("");
    expect(lead.message).toBe(validLead.message);
  });

  it("accepts a phone number in the contact field", () => {
    expect(
      chatLeadSchema.safeParse({ ...validLead, contact: "+234 800 000 0000" })
        .success,
    ).toBe(true);
  });

  it("rejects an empty name, contact, or message", () => {
    for (const key of ["name", "contact", "message"] as const) {
      expect(
        chatLeadSchema.safeParse({ ...validLead, [key]: "  " }).success,
      ).toBe(false);
    }
  });

  it("rejects unknown fields", () => {
    expect(
      chatLeadSchema.safeParse({ ...validLead, phone: "123" }).success,
    ).toBe(false);
  });
});
