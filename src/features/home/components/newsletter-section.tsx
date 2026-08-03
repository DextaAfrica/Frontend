import { Section } from "@/components/layout";
import { Reveal } from "@/components/marketing";
import { EditorialEyebrow, EditorialHeading } from "@/components/ui";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";

export function NewsletterSection({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <Section spacing="md" tone="surface">
      <Reveal className="relative overflow-hidden rounded-2xl bg-muted px-6 py-10 sm:px-12 sm:py-12">
        <div className="relative z-10 max-w-newsletter-copy">
          <EditorialEyebrow className="text-muted-foreground">
            {eyebrow}
          </EditorialEyebrow>
          <EditorialHeading className="text-newsletter-title mt-4 max-w-newsletter-title">
            {title}
          </EditorialHeading>
          <InlineNewsletterForm />
        </div>
        <div aria-hidden className="newsletter-card-stack hidden md:block">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className="newsletter-stack-card absolute h-newsletter-card w-newsletter-card rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
