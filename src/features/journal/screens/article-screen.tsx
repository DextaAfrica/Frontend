import { Page, Section, Stack } from "@/components/layout";
import { EditorialHero, MediaPanel } from "@/components/marketing";
import { ButtonLink, SectionHeading, Text } from "@/components/ui";
import type { JournalArticle } from "@/data/articles";

export function ArticleScreen({ article }: { article: JournalArticle }) {
  return (
    <Page>
      <EditorialHero
        eyebrow={`${article.category} · ${article.date}`}
        title={article.title}
        description={article.introduction}
      />
      <Section tone="surface">
        <Stack gap="2xl" className="mx-auto max-w-4xl">
          <MediaPanel
            label={article.title}
            tone={article.tone}
            className="min-h-[26rem]"
          />
          {article.sections.map((section) => (
            <section key={section.title}>
              <Stack gap="sm">
                <SectionHeading size="compact">{section.title}</SectionHeading>
                <Text>{section.body}</Text>
              </Stack>
            </section>
          ))}
          <ButtonLink href="/journal" variant="outline" className="w-fit">
            Back to journal
          </ButtonLink>
        </Stack>
      </Section>
    </Page>
  );
}
