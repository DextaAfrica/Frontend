import { describe, expect, it } from "vitest";
import { enquirySchema } from "./enquiry";

const validEnquiry = {
  firstName: "Ada",
  lastName: "Okafor",
  email: "ada@example.com",
  phone: "+234 800 000 0000",
  interest: "Investment opportunity",
  message: "I would like to discuss available projects.",
  consent: true,
};

describe("enquirySchema", () => {
  it("accepts and normalizes a complete enquiry", () => {
    const enquiry = enquirySchema.parse({
      ...validEnquiry,
      email: " ADA@EXAMPLE.COM ",
    });

    expect(enquiry.email).toBe("ada@example.com");
    expect(enquiry.company).toBe("");
  });

  it("requires explicit consent", () => {
    expect(
      enquirySchema.safeParse({ ...validEnquiry, consent: false }).success,
    ).toBe(false);
  });

  it("rejects unsupported interests", () => {
    expect(
      enquirySchema.safeParse({ ...validEnquiry, interest: "Other" }).success,
    ).toBe(false);
  });
});
