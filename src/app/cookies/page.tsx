import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalScreen } from "@/features/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Dexta Africa uses cookies and browser storage.",
};

export default function CookiesPage() {
  return (
    <LegalScreen
      eyebrow="Legal"
      title="Cookie policy."
      description="A practical guide to the cookies and browser storage used on this website—and how you control them."
      sections={[
        {
          title: "What these technologies are",
          body: "Cookies are small text files stored by a website in your browser. Similar technologies, including local storage, can remember information on a device. We use the term ‘cookies’ here to describe both. Some are necessary for a feature you request; optional technologies require your choice where applicable.",
        },
        {
          title: "Strictly necessary storage",
          body: "Necessary storage supports core functions and cannot be disabled through our preference centre. The current site uses local browser storage rather than advertising cookies for these functions.",
          items: [
            "dexta-africa-consent records necessary, analytics, and marketing choices with the date they were updated.",
            "dexta-africa-newsletter remembers whether the newsletter invitation was dismissed or a subscription completed, preventing repeated prompts for up to 30 days after dismissal.",
            "Theme preference storage remembers light, dark, or system appearance where you choose a setting.",
          ],
        },
        {
          title: "Analytics",
          body: "Analytics technologies may help us understand aggregate visits, navigation, performance, and errors so we can improve the site. They are optional and must not be activated by this application until analytics consent is enabled. Any analytics provider added later must be documented here before production use.",
        },
        {
          title: "Marketing",
          body: "Marketing technologies may measure campaigns or support relevant communications across services. They are optional and must not be activated until marketing consent is enabled. Submitting the newsletter form is a direct request and is separately recorded; it does not automatically enable marketing cookies.",
        },
        {
          title: "Duration and recipients",
          body: "Consent is stored until you clear site data or replace your choice. A dismissed newsletter prompt is reconsidered after 30 days; a successful subscription remains remembered on that browser. If an approved analytics or marketing provider is introduced, its name, purpose, recipients, and retention period should be added to this policy before activation.",
        },
        {
          title: "Manage or withdraw consent",
          body: "Use Cookie settings in the footer to accept or reject optional categories at any time. You can also delete or block storage in your browser, although removing necessary storage may reset theme and consent choices or affect requested functionality. Withdrawing consent does not affect processing that occurred lawfully before withdrawal.",
        },
        {
          title: "Browser privacy signals",
          body: "Browser ‘Do Not Track’ signals are not implemented consistently across the industry. Our own optional categories remain controlled by the choice made in the preference centre. We will reassess recognised privacy signals as standards and applicable requirements evolve.",
        },
        {
          title: "Changes and contact",
          body: `We will update this policy if technologies or providers change and revise the date above. Questions about cookies or privacy may be sent to ${siteConfig.contact.email}.`,
        },
      ]}
    />
  );
}
