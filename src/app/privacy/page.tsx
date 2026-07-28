import type { Metadata } from "next";
import { LegalScreen } from "@/features/legal";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <LegalScreen
      eyebrow="Legal"
      title="Privacy, clearly explained."
      description="How Maison Rouge collects, uses, stores, and protects personal information."
      sections={[
        {
          title: "Information we collect",
          body: "We collect information you submit through enquiry forms, including contact details, property interests, and communication preferences. We may also collect essential technical information required to operate and secure the website.",
        },
        {
          title: "How information is used",
          body: "Information is used to respond to enquiries, arrange appointments, provide requested development information, improve our services, and meet legal obligations. We do not sell personal information.",
        },
        {
          title: "Your choices",
          body: "You may request access, correction, or deletion of eligible personal information and can update optional cookie preferences at any time using Cookie settings in the footer.",
        },
      ]}
    />
  );
}
