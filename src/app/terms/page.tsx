import type { Metadata } from "next";
import { LegalScreen } from "@/features/legal";
export const metadata: Metadata = { title: "Terms and Conditions" };
export default function TermsPage() {
  return (
    <LegalScreen
      eyebrow="Legal"
      title="Terms of use."
      description="The terms governing access to and use of the Maison Rouge website."
      sections={[
        {
          title: "Website information",
          body: "Content is provided for general information and may change as projects evolve. Illustrations, pricing, availability, specifications, and completion dates remain subject to formal agreements.",
        },
        {
          title: "Intellectual property",
          body: "The Maison Rouge name, original text, generated campaign imagery, interface, and associated materials may not be reproduced without permission.",
        },
        {
          title: "Responsible use",
          body: "Users must not interfere with website security, submit unlawful material, impersonate another person, or use the website in a way that harms Maison Rouge or others.",
        },
      ]}
    />
  );
}
