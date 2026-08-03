import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  MediaPanel,
} from "@/components/marketing";
import { Card, CardContent, CardHeading, Text } from "@/components/ui";

const experiences = [
  {
    title: "Wellbeing",
    text: "Spaces for movement, restoration, and unhurried moments of calm.",
  },
  {
    title: "Hospitality",
    text: "Attentive service that is present when needed and invisible when not.",
  },
  {
    title: "Connection",
    text: "Private lounges, gardens, and tables designed for meaningful gathering.",
  },
];
export function LifestyleScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="The Dexta Africa experience"
        title="Luxury, felt rather than announced."
        description="The most meaningful amenities are those that make daily life flow beautifully—from the first coffee to the final arrival home."
      />
      <Section tone="surface">
        <Grid columns="two" gap="xl" className="items-center">
          <MediaPanel
            label="Morning light, considered interiors"
            tone="light"
            className="min-h-[36rem]"
          />
          <Stack gap="lg">
            <MarketingHeading
              eyebrow="Living well"
              title="Designed around the rhythm of your day."
            />
            <Text>
              Our residences extend beyond the private home. Wellness rooms,
              gardens, pools, lounges, workspaces, and thoughtful service create
              a complete environment for modern life.
            </Text>
          </Stack>
        </Grid>
      </Section>
      <Section>
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="The experience"
            title="Everything you need. Nothing you don’t."
            centered
          />
          <Grid columns="three">
            {experiences.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-7">
                  <Stack gap="sm">
                    <CardHeading className="text-2xl">{item.title}</CardHeading>
                    <Text className="text-sm">{item.text}</Text>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid columns="two" gap="lg">
            <MediaPanel
              label="Private dining"
              tone="ruby"
              className="min-h-[28rem]"
            />
            <MediaPanel
              label="Restorative landscapes"
              tone="dusk"
              className="min-h-[28rem]"
            />
          </Grid>
        </Stack>
      </Section>
    </Page>
  );
}
