import { Page, Section, Stack } from "@/components/layout";
import { EditorialHero, MediaPanel } from "@/components/marketing";
import { ButtonLink, SectionHeading, Text } from "@/components/ui";
import type { Article } from "../data/articles";

export function ArticleScreen({ article }: { article: Article }) {
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
            className="min-h-article-media"
          />
          {article.sections.map((section) => (
            <section key={section.title}>
              <Stack gap="sm">
                <SectionHeading size="compact">{section.title}</SectionHeading>
                <Text>{section.body}</Text>
              </Stack>
            </section>
          ))}
          <ButtonLink href="/blog" variant="outline" className="w-fit">
            Back to blog
          </ButtonLink>
        </Stack>
      </Section>
    </Page>
  );
}
