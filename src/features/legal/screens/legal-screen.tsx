import { Grid, Page, Section, Stack } from "@/components/layout";
import { MediaHero, TocNav } from "@/components/marketing";
import { Eyebrow, SectionHeading, Text } from "@/components/ui";
import { slugify } from "@/lib/utils";

/** Shared banner image for the legal pages — a neutral brand exterior. */
const LEGAL_HERO_IMAGE = "/images/dexta-hero-poster.jpg";

export interface LegalSection {
  title: string;
  body: string;
  items?: string[];
}
export function LegalScreen({
  eyebrow,
  title,
  description,
  sections,
  lastUpdated = "28 July 2026",
  image = LEGAL_HERO_IMAGE,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  lastUpdated?: string;
  image?: string;
}) {
  const tocItems = sections.map((section) => ({
    id: slugify(section.title),
    label: section.title,
  }));

  return (
    <Page>
      <MediaHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={image}
      />
      <Section tone="surface">
        <Grid columns="four" gap="xl" className="items-start">
          <TocNav
            items={tocItems}
            className="sticky top-28 hidden lg:col-span-1 lg:flex"
          />
          <Stack gap="2xl" className="col-span-full lg:col-span-3">
            <Eyebrow className="border-b border-border pb-5 text-muted-foreground">
              Last updated: {lastUpdated}
            </Eyebrow>
            {sections.map((section) => (
              <section key={section.title} id={slugify(section.title)}>
                <Stack gap="sm">
                  <SectionHeading size="compact">
                    {section.title}
                  </SectionHeading>
                  <Text>{section.body}</Text>
                  {section.items && (
                    <ul className="grid gap-2 pl-5 text-base leading-7 text-muted-foreground marker:text-primary">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </Stack>
              </section>
            ))}
          </Stack>
        </Grid>
      </Section>
    </Page>
  );
}
