import { Grid, Page, Section, Stack } from "@/components/layout";
import { EditorialHero, MarketingHeading } from "@/components/marketing";
import { Icon, Text } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { EnquiryForm } from "../components/enquiry-form";

export function ContactScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Contact"
        title="Let’s begin a conversation."
        description="Whether you are looking for a home, considering an investment, or exploring a partnership, our team is here to help."
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
            className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8"
            aria-label="Enquiry form"
          >
            <EnquiryForm />
          </section>
        </Grid>
      </Section>
    </Page>
  );
}
