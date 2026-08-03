import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  MediaPanel,
  QuoteBlock,
} from "@/components/marketing";
import { Card, CardContent, CardHeading, Text } from "@/components/ui";

const values = [
  {
    title: "Intent",
    text: "Every decision begins with purpose and ends with a better lived experience.",
  },
  {
    title: "Craft",
    text: "Materials, details, and delivery are held to one uncompromising standard.",
  },
  {
    title: "Legacy",
    text: "We create places that grow in meaning and value across generations.",
  },
];
export function AboutScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="About Dexta Africa"
        title="We build for what endures."
        description="Dexta Africa delivers value-driven real estate solutions across development, investment, and property services."
      />
      <Section tone="surface">
        <Grid columns="two" gap="xl" className="items-center">
          <Stack gap="lg">
            <MarketingHeading
              eyebrow="Our story"
              title="A different measure of progress."
            />
            <Text>
              We believe development is not a race to completion. It is a
              patient process of finding the right site, assembling the right
              minds, and refining every choice until the result feels
              inevitable.
            </Text>
            <Text>
              Our multidisciplinary approach aligns design, delivery, and
              experience from the beginning—protecting the original vision
              through every stage.
            </Text>
          </Stack>
          <MediaPanel
            label="The studio at work"
            tone="stone"
            className="min-h-[34rem]"
          />
        </Grid>
      </Section>
      <Section>
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="What guides us"
            title="Principles made visible."
          />
          <Grid columns="three">
            {values.map((value, index) => (
              <Card key={value.title}>
                <CardContent className="p-7">
                  <Stack gap="md">
                    <span className="text-sm font-bold text-primary">
                      0{index + 1}
                    </span>
                    <CardHeading size="lg">{value.title}</CardHeading>
                    <Text className="text-sm">{value.text}</Text>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
      <QuoteBlock
        quote="The best architecture makes life feel both simpler and more expansive."
        author="David Adeyemi"
        role="Development Director"
      />
    </Page>
  );
}
