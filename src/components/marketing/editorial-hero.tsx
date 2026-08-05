import { Cluster, Section, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/utils";

interface EditorialHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}
export function EditorialHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  className,
}: EditorialHeroProps) {
  return (
    <Section spacing="lg" className={cn("overflow-hidden", className)}>
      <span aria-hidden className="editorial-hero-glow absolute inset-0" />
      <Stack gap="lg" align="start" className="enter-fade relative max-w-4xl">
        <Stack gap="sm" align="start">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading>{title}</Heading>
        </Stack>
        <Text className="max-w-2xl text-pretty">{description}</Text>
        {(primary || secondary) && (
          <Cluster>
            {primary && (
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
                <Icon name="arrow-right" />
              </ButtonLink>
            )}
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </Cluster>
        )}
      </Stack>
    </Section>
  );
}
