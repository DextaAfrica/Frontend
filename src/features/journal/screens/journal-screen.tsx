import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  MediaPanel,
} from "@/components/marketing";
import {
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Text,
} from "@/components/ui";
import { articles } from "@/data/articles";
export function JournalScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Journal"
        title="Ideas for a more considered world."
        description="Perspectives on architecture, material, place, culture, and the evolving meaning of home."
      />
      <Section tone="surface">
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="Latest perspectives"
            title="From the studio and beyond."
          />
          <Grid columns="two" gap="lg">
            {articles.map((article) => (
              <Card key={article.title} className="group overflow-hidden">
                <MediaPanel
                  label={article.title}
                  tone={article.tone}
                  className="min-h-72 rounded-none"
                />
                <CardContent className="p-6">
                  <Stack gap="sm">
                    <p className="text-xs font-bold tracking-[0.12em] text-primary uppercase">
                      {article.category} · {article.date}
                    </p>
                    <CardHeading className="text-2xl">
                      {article.title}
                    </CardHeading>
                    <Text className="text-sm">
                      Exploring the decisions and ideas that shape enduring
                      places and more meaningful daily experiences.
                    </Text>
                    <ButtonLink
                      href={`/journal/${article.slug}`}
                      variant="link"
                    >
                      Read perspective
                    </ButtonLink>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </Page>
  );
}
