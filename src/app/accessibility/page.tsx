import type { Metadata } from "next";
import { LegalScreen } from "@/features/legal";
export const metadata: Metadata = { title: "Accessibility" };
export default function AccessibilityPage() {
  return (
    <LegalScreen
      eyebrow="Accessibility"
      title="An experience designed for everyone."
      description="Our commitment to an inclusive, understandable, and operable digital experience."
      sections={[
        {
          title: "Our approach",
          body: "We use semantic structure, keyboard-operable controls, visible focus states, responsive layouts, meaningful labels, sufficient contrast, and reduced-motion preferences throughout the website.",
        },
        {
          title: "Continuous improvement",
          body: "Accessibility is reviewed as the product evolves. New Figma designs and components should preserve these foundations rather than treating accessibility as a final-stage addition.",
        },
        {
          title: "Need assistance?",
          body: "If any part of this website prevents you from accessing information or completing an enquiry, contact our team and we will provide an appropriate alternative.",
        },
      ]}
    />
  );
}
