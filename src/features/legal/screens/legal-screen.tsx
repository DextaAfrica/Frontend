import { Page, Section, Stack } from "@/components/layout";
import { EditorialHero } from "@/components/marketing";
import { SectionHeading, Text } from "@/components/ui";

export interface LegalSection {
  title: string;
  body: string;
}
export function LegalScreen({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
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
          {sections.map((section) => (
            <section key={section.title}>
              <Stack gap="sm">
                <SectionHeading className="text-2xl sm:text-3xl">
                  {section.title}
                </SectionHeading>
                <Text>{section.body}</Text>
              </Stack>
            </section>
          ))}
        </Stack>
      </Section>
    </Page>
  );
}
