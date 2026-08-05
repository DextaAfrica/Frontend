import type { Metadata } from "next";
import { Grid, Page, Section, Stack } from "@/components/layout";
import { EditorialHero, MarketingHeading } from "@/components/marketing";
import {
  ButtonLink,
  Card,
  CardContent,
  CardHeading,
  Text,
} from "@/components/ui";
export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join a multidisciplinary team building thoughtful, exacting real estate across Nigeria.",
  alternates: { canonical: "/careers" },
};
const roles = [
  {
    title: "Design & Architecture",
    text: "Architects, interior designers, visualisers, and design managers.",
  },
  {
    title: "Development",
    text: "Project, commercial, delivery, and development management professionals.",
  },
  {
    title: "Brand & Experience",
    text: "People shaping communication, hospitality, customer experience, and culture.",
  },
];
export default function CareersPage() {
  return (
    <Page>
      <EditorialHero
        eyebrow="Careers"
        title="Build places that outlast us."
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
            {roles.map((role) => (
              <Card key={role.title}>
                <CardContent className="p-7">
                  <Stack gap="sm">
                    <CardHeading size="md">{role.title}</CardHeading>
                    <Text className="text-sm">{role.text}</Text>
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
