import { Grid, Page, Section, Stack } from "@/components/layout";
import { EditorialHero, MarketingHeading } from "@/components/marketing";
import {
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Text,
} from "@/components/ui";
import { careerAreas } from "../data/roles";

export function CareersScreen() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Careers"
        title="Build places that *outlast* us."
        description="Join a multidisciplinary team committed to thoughtful work, exacting craft, and a more meaningful built environment."
        primary={{ label: "Introduce yourself", href: "/contact" }}
      />
      <Section tone="surface">
        <Stack gap="2xl">
          <MarketingHeading
            eyebrow="Opportunities"
            title="Where your perspective can contribute."
          />
          <Grid columns="three">
            {careerAreas.map((area) => (
              <Card key={area.title}>
                <CardContent className="p-7">
                  <Stack gap="sm">
                    <CardHeading size="md">{area.title}</CardHeading>
                    <Text className="text-sm">{area.text}</Text>
                    <ButtonLink href="/contact" variant="link">
                      Contact the studio
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
