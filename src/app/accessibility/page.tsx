import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalScreen } from "@/features/legal";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Dexta Africa's commitment to an accessible digital experience.",
};

export default function AccessibilityPage() {
  return (
    <LegalScreen
      eyebrow="Accessibility"
      title="Designed for more people."
      description="Our commitment to an inclusive, understandable, and operable digital experience."
      sections={[
        {
          title: "Our commitment",
          body: "Dexta Africa aims to provide a website that can be used by people with diverse abilities, technologies, and ways of interacting. Accessibility is considered in design, content, development, and quality assurance, and we use the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA as our intended benchmark.",
        },
        {
          title: "Measures we take",
          body: "The website uses semantic page landmarks, logical headings, descriptive labels, keyboard-operable controls, visible focus states, text alternatives for meaningful imagery, adaptable responsive layouts, and colour contrast intended to support readability.",
          items: [
            "Navigation and modal dialogs are designed for keyboard use and managed focus.",
            "Forms provide visible labels, instructions, validation messages, and status feedback.",
            "Motion is reduced when the device preference requests reduced motion.",
            "Content is intended to remain usable when text is enlarged or the viewport is narrow.",
            "Video should include an accessible alternative, captions, or transcript where speech conveys essential information.",
          ],
        },
        {
          title: "Compatibility and limitations",
          body: "The experience is designed for current versions of major browsers and common assistive technologies. Some third-party content, older devices, or newly introduced features may not yet provide an equivalent experience. We prioritise fixes according to impact and provide an alternative way to access information whenever practical.",
        },
        {
          title: "Continuous improvement",
          body: "Accessibility is reviewed as the product evolves. New designs and components should preserve these foundations, and material journeys are checked with keyboard navigation, responsive layouts, reduced-motion settings, and automated tooling. Automated tests are useful but do not replace informed manual review.",
        },
        {
          title: "Feedback and assistance",
          body: `If a barrier prevents you from accessing information or completing an enquiry, contact ${siteConfig.contact.email} or ${siteConfig.contact.phone}. Tell us the page, the problem, your browser or assistive technology if comfortable, and the format you need. We will acknowledge the request and work to provide an accessible alternative.`,
        },
      ]}
    />
  );
}
