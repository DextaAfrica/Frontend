import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalScreen } from "@/features/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Dexta Africa handles and protects personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalScreen
      eyebrow="Legal"
      title="Privacy, clearly explained."
      description="This policy explains what personal data Dexta Africa collects, why we use it, and the choices available to you."
      sections={[
        {
          title: "Who we are and the scope of this policy",
          body: `Dexta Africa is the controller of personal data handled through this website and our property enquiry services. This policy applies when you browse our website, subscribe to updates, request information, arrange a viewing, or otherwise communicate with us. Questions may be sent to ${siteConfig.contact.email} or by post to ${siteConfig.contact.address}.`,
        },
        {
          title: "Information we collect",
          body: "We collect only information reasonably needed to provide and improve our services.",
          items: [
            "Identity and contact data, such as your name, email address, telephone number, and preferred contact method.",
            "Enquiry data, including property interests, budget or purchase preferences, appointment requests, and messages you send us.",
            "Marketing preferences, newsletter subscription status, consent choices, and unsubscribe requests.",
            "Technical and usage data, including IP address, browser and device type, referral page, security events, and website interactions where permitted.",
            "Information supplied by an authorised representative, agent, event partner, or property professional where lawful and appropriate.",
          ],
        },
        {
          title: "How and why we use information",
          body: "We process personal data to respond to enquiries and take steps requested before a possible transaction; deliver subscriptions and communications you request; operate, secure, diagnose, and improve the website; understand service performance; keep appropriate business records; establish or defend legal claims; and comply with applicable law. Depending on the activity, we rely on your consent, steps connected with a possible contract, our legitimate interests in operating and improving our business, or a legal obligation. Where consent applies, it may be withdrawn at any time without affecting earlier lawful processing.",
        },
        {
          title: "Newsletter and direct marketing",
          body: "We send property news, private-preview invitations, and editorial updates only where we have an appropriate basis to do so. Every marketing email should provide an unsubscribe method. Unsubscribing stops future marketing but does not prevent service messages concerning an active enquiry. Subscription details are delivered through our configured newsletter service; we do not sell subscriber information.",
        },
        {
          title: "Cookies and similar storage",
          body: "Essential browser storage remembers theme, consent, and newsletter-prompt choices. Analytics or marketing technologies must remain disabled unless you permit them. The Cookie Policy explains the categories, purposes, and controls in more detail, and preferences can be changed at any time through Cookie settings in the footer.",
        },
        {
          title: "Who receives information",
          body: "We may share the minimum necessary data with authorised staff; hosting, security, analytics, communications, customer-management, and professional-service providers acting under appropriate obligations; property partners involved in an enquiry; regulators, courts, or law-enforcement bodies where required; and a successor in a legitimate corporate transaction. Providers may use data only for the agreed service or as the law permits.",
        },
        {
          title: "International transfers",
          body: "Some service providers may process information outside Nigeria. Where this occurs, we assess the transfer and use safeguards required by applicable data-protection law, such as an adequacy basis, contractual protections, or another lawful transfer mechanism. You may contact us for information about safeguards relevant to your data.",
        },
        {
          title: "Retention and security",
          body: "We retain personal data only as long as required for the stated purpose, an ongoing relationship, dispute management, or legal and regulatory obligations. Retention periods consider the nature and sensitivity of the information and the risk of harm. We use proportionate organisational and technical controls, but no internet transmission or storage system can be guaranteed completely secure.",
        },
        {
          title: "Your rights",
          body: "Subject to applicable conditions and exemptions, you may ask to be informed about processing; access your data; correct inaccurate or incomplete data; erase data; restrict or object to processing; receive portable data; withdraw consent; and request review of certain solely automated decisions. We may verify identity before acting and will explain if a request cannot be fulfilled. You may also lodge a complaint with the Nigeria Data Protection Commission.",
        },
        {
          title: "Children, external links, and changes",
          body: "This website is intended for adults and is not designed to knowingly collect personal data from children. External websites operate under their own policies. We may update this notice when our services or legal duties change; material changes will be highlighted where appropriate and the date above will be revised.",
        },
        {
          title: "Contact us",
          body: `For a privacy request or question, email ${siteConfig.contact.email}, call ${siteConfig.contact.phone}, or write to ${siteConfig.contact.address}. Please do not send sensitive identity documents until we provide a secure method.`,
        },
      ]}
    />
  );
}
