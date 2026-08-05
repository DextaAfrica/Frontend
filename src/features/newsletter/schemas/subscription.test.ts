import { describe, expect, it } from "vitest";
import { newsletterSubscriptionSchema } from "./subscription";

describe("newsletterSubscriptionSchema", () => {
  it("normalizes a valid subscription", () => {
    const result = newsletterSubscriptionSchema.parse({
      email: "  PERSON@Example.COM ",
      source: "landing_page",
    });

    expect(result.email).toBe("person@example.com");
    expect(result.consent).toBeNull();
  });

  it.each(["", "person", "person@", "@example.com"])(
    "rejects invalid email %j",
    (email) => {
      expect(newsletterSubscriptionSchema.safeParse({ email }).success).toBe(
        false,
      );
    },
  );

  it("rejects untrusted fields", () => {
    expect(
      newsletterSubscriptionSchema.safeParse({
        email: "person@example.com",
        role: "admin",
      }).success,
    ).toBe(false);
  });
});
