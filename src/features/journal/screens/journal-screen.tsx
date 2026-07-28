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

const articles = [
  {
    title: "The return of warm modernism",
    category: "Design",
    date: "18 July 2026",
    tone: "ruby" as const,
  },
  {
    title: "Building for the Lagos climate",
    category: "Architecture",
    date: "03 July 2026",
    tone: "stone" as const,
  },
  {
    title: "Why landscape begins at the front door",
    category: "Living",
    date: "22 June 2026",
    tone: "dusk" as const,
  },
  {
    title: "Inside the material library",
    category: "Studio",
    date: "08 June 2026",
    tone: "light" as const,
  },
];
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
                    <ButtonLink href="/contact" variant="link">
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
