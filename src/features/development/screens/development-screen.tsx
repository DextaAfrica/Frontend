import { Grid, Page, Section, Stack } from "@/components/layout";
import {
  EditorialHero,
  MarketingHeading,
  MediaPanel,
  QuoteBlock,
} from "@/components/marketing";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Text,
} from "@/components/ui";

const residences = [
  { name: "One bedroom", area: "72–88 m²", price: "From ₦280m" },
  { name: "Two bedroom", area: "128–164 m²", price: "From ₦465m" },
  { name: "Three bedroom", area: "210–255 m²", price: "From ₦720m" },
  { name: "Sky residence", area: "410 m²", price: "By enquiry" },
];
export function DevelopmentScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Seren Redwood · Ikoyi"
        title="Private by nature. Remarkable by design."
        description="A limited collection of lagoon-facing residences bringing generous space, warm modernism, and private hospitality to one of Lagos’s most established neighbourhoods."
        primary={{ label: "Register your interest", href: "/contact" }}
        secondary={{ label: "View residences", href: "#residences" }}
      />
      <Section tone="surface">
        <Grid columns="two" gap="xl" className="items-center">
          <MediaPanel
            label="Seren Redwood arrival"
            tone="ruby"
            className="min-h-[38rem]"
          />
          <Stack gap="lg">
            <Badge>Now selling</Badge>
            <MarketingHeading
              eyebrow="The residence"
              title="Composed around how you live."
            />
            <Text>
              Deep terraces, full-height glazing, and carefully framed views
              create homes that feel open yet protected. Natural stone, warm
              timber, and crafted metalwork bring calm material richness.
            </Text>
            <Grid columns="two" gap="sm">
              <p>
                <strong>28</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  Private residences
                </span>
              </p>
              <p>
                <strong>2028</strong>
                <br />
                <span className="text-sm text-muted-foreground">
                  Anticipated completion
                </span>
              </p>
            </Grid>
          </Stack>
        </Grid>
      </Section>
      <Section id="residences">
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="Residences"
            title="Space for every chapter."
          />
          <Grid columns="four">
            {residences.map((item) => (
              <Card key={item.name}>
                <CardContent className="p-6">
                  <Stack gap="sm">
                    <CardHeading>{item.name}</CardHeading>
                    <Text className="text-sm">{item.area}</Text>
                    <p className="font-semibold text-primary">{item.price}</p>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <ButtonLink href="/contact" size="lg" className="mx-auto">
            Request availability
          </ButtonLink>
        </Stack>
      </Section>
      <QuoteBlock
        quote="Privacy is the ultimate luxury: space, light, calm, and the freedom to live entirely at your own rhythm."
        author="Seren Redwood"
        role="Design vision"
      />
      <Section>
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="Amenities"
            title="Everyday rituals, elevated."
          />
          <Grid columns="three">
            <MediaPanel label="Residents’ lounge" tone="stone" />
            <MediaPanel label="Wellness and movement" tone="light" />
            <MediaPanel label="Garden and pool" tone="dusk" />
          </Grid>
        </Stack>
      </Section>
    </Page>
  );
}
