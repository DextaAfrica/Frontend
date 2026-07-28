import { Grid, Section, Stack } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  Eyebrow,
  Icon,
  IconBox,
  SectionHeading,
  Text,
} from "@/components/ui";
import { foundations } from "../data/foundations";

export function FoundationSection() {
  return (
    <Section id="foundation" tone="surface" className="border-y border-border">
      <Stack gap="2xl">
        <Stack gap="sm" align="start">
          <Eyebrow>Foundation</Eyebrow>
          <SectionHeading className="max-w-2xl">
            Every recurring layout decision has a home.
          </SectionHeading>
          <Text className="max-w-2xl">
            Future screens should describe product intent. The design system
            owns alignment, rhythm, width, responsiveness, and visual states.
          </Text>
        </Stack>
        <Grid columns="four">
          {foundations.map(({ icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <IconBox>
                  <Icon name={icon} />
                </IconBox>
              </CardHeader>
              <CardContent>
                <Stack gap="sm">
                  <CardHeading>{title}</CardHeading>
                  <Text className="text-sm leading-6">{description}</Text>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
