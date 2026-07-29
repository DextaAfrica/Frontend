import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalScreen } from "@/features/legal";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms governing use of the Maison Rouge website.",
};

export default function TermsPage() {
  return (
    <LegalScreen
      eyebrow="Legal"
      title="Terms of use."
      description="These terms govern access to and use of the Maison Rouge website."
      sections={[
        {
          title: "Acceptance and eligibility",
          body: "By using this website, you agree to these terms and our Privacy and Cookie Policies. If you do not agree, do not use the website. You must be legally capable of entering an agreement or use the site under the supervision of someone who is.",
        },
        {
          title: "Property information is indicative",
          body: "Website content is general marketing information, not a binding offer, reservation, warranty, valuation, investment recommendation, or legal, tax, or financial advice. Availability, prices, incentives, dimensions, specifications, service charges, completion dates, views, and amenities may change and must be confirmed in the relevant formal documents before any commitment.",
        },
        {
          title: "Images, plans, and measurements",
          body: "Computer-generated images, photography, videos, plans, maps, furniture layouts, and landscaping are illustrative. Finishes and views may differ from the completed property. Dimensions and areas are approximate and should not be used for fitting furniture or ordering materials. Purchasers must rely on signed contractual documents and their own professional advisers.",
        },
        {
          title: "Enquiries and communications",
          body: "Submitting a form, joining a mailing list, or arranging a viewing does not create an agency, sale, lease, or other property agreement. You are responsible for ensuring submitted details are accurate and that you are authorised to provide them. Marketing preferences can be changed using the method provided in our communications.",
        },
        {
          title: "Permitted use",
          body: "You may browse and make a reasonable personal copy of site content for evaluating our services. You must not misuse the site, attempt unauthorised access, introduce malicious code, scrape or extract content at scale, interfere with operation or security, impersonate another person, submit unlawful material, or use content for a competing commercial service.",
        },
        {
          title: "Intellectual property",
          body: "Unless stated otherwise, the website, brand, copy, interface, graphics, photography, video, and other original material are owned by or licensed to Maison Rouge and protected by applicable intellectual-property law. No licence is granted except the limited right to use the site under these terms. Third-party marks remain the property of their owners.",
        },
        {
          title: "Third-party services and links",
          body: "Links and integrations may lead to services we do not control. They are provided for convenience and do not imply endorsement. Their availability, security, content, and privacy practices are governed by their own terms, and you should review those terms before using them.",
        },
        {
          title: "Availability and warranties",
          body: "We aim to keep the website accurate, secure, and available, but it is provided on an ‘as available’ basis. To the extent permitted by law, we do not guarantee uninterrupted access, freedom from errors or harmful components, or that all information is complete and current. Nothing in these terms excludes a warranty or right that cannot lawfully be excluded.",
        },
        {
          title: "Liability",
          body: "To the maximum extent permitted by law, Maison Rouge is not liable for indirect or consequential loss, lost profits, lost opportunity, or loss arising from reliance on indicative website content or third-party services. Nothing limits liability where limitation is prohibited, including liability for fraud or other liability that applicable law does not permit us to exclude.",
        },
        {
          title: "Changes, suspension, and termination",
          body: "We may update content, features, and these terms, or suspend access for maintenance, security, legal, or operational reasons. Revised terms apply from the date shown above. We may restrict access where these terms are breached, without affecting rights already accrued.",
        },
        {
          title: "Governing law and general provisions",
          body: "These terms are governed by the laws of the Federal Republic of Nigeria, and disputes are subject to the jurisdiction of the competent Nigerian courts. If a provision is unenforceable, the remaining provisions continue. Delay in enforcing a right is not a waiver. These website terms do not replace a signed property agreement.",
        },
        {
          title: "Contact",
          body: `Questions about these terms may be sent to ${siteConfig.contact.email} or ${siteConfig.contact.address}.`,
        },
      ]}
    />
  );
}
