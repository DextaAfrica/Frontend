import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  ContactMap,
  MarketingHeading,
  MediaHero,
} from "@/components/marketing";
import { Icon, Text } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { EnquiryForm } from "../components/enquiry-form";

export function ContactScreen() {
  return (
    <Page>
      <MediaHero
        eyebrow="Contact"
        title={["Let’s begin", "a *conversation*."]}
        description="Whether you are looking for a home, considering an investment, or exploring a partnership, our team is here to help."
        image="/images/residence-exterior.png"
        // The building's roofline sits only a few percent from the top of
        // this photo — a centred crop on the wider hero frame was clipping
        // it. Anchoring to the top instead crops the low-detail foliage at
        // the bottom, never the roofline.
        imagePosition="center top"
        primary={{ label: "Book an inspection", href: "#enquiry" }}
      />
      <Section tone="surface">
        <Grid columns="two" gap="xl" className="items-start">
          <Stack gap="lg">
            <MarketingHeading
              eyebrow="Private client team"
              title="Tell us what you’re looking for."
              description="Complete the form and a dedicated advisor will contact you personally."
            />
            <Stack gap="md" className="pt-4">
              <span className="flex items-center gap-3">
                <Icon name="phone" className="text-primary" />
                {siteConfig.contact.phone}
              </span>
              <span className="flex items-center gap-3">
                <Icon name="mail" className="text-primary" />
                {siteConfig.contact.email}
              </span>
              <span className="flex items-start gap-3">
                <Icon name="pin" className="mt-1 shrink-0 text-primary" />
                <Text className="text-base">{siteConfig.contact.address}</Text>
              </span>
            </Stack>
          </Stack>
          <section
            id="enquiry"
            className="scroll-mt-28 rounded-panel border border-border bg-surface-elevated p-6 shadow-[var(--control-shadow)] sm:p-8"
            aria-label="Enquiry form"
          >
            <EnquiryForm />
          </section>
        </Grid>
      </Section>

      <Section>
        <Stack gap="xl">
          <MarketingHeading
            eyebrow="Find us"
            title="Visit the studio."
            description="Drop by during business hours, or get directions straight from the map."
          />
          <ContactMap address={siteConfig.contact.address} />
        </Stack>
      </Section>
    </Page>
  );
}
