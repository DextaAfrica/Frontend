import { Page, Section, Stack } from "@/components/layout";
import { EditorialHero } from "@/components/marketing";
import { SectionHeading, Text } from "@/components/ui";

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
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  lastUpdated?: string;
}) {
  return (
    <Page>
      <EditorialHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <Section tone="surface">
        <Stack gap="2xl" className="mx-auto max-w-4xl">
          <p className="border-b border-border pb-5 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Last updated: {lastUpdated}
          </p>
          {sections.map((section) => (
            <section key={section.title}>
              <Stack gap="sm">
                <SectionHeading className="text-2xl sm:text-3xl">
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
      </Section>
    </Page>
  );
}
