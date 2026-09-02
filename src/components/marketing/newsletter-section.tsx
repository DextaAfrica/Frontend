import { Container, Section } from "@/components/layout";
import { Badge, Icon, type IconName } from "@/components/ui";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";
import { Reveal } from "./reveal";

const benefits: ReadonlyArray<{ icon: IconName; label: string }> = [
  { icon: "land-plot", label: "Off-market listings" },
  { icon: "valuation", label: "Market reports" },
  { icon: "badge-check", label: "Early access" },
];

export interface NewsletterSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

/**
 * The homepage newsletter ask — a split, card-led layout (copy + benefit
 * chips on one side, a standalone signup card on the other) rather than the
 * centered editorial-heading treatment used for content sections: this is a
 * conversion moment, not an article intro, so it skips the serif/Playfair
 * voice entirely and leans on the same bold sans, pulsing "signal" dot, and
 * primary-tinted glow already established by the expertise marquee and
 * Dexta Clan band elsewhere on the page.
 */
export function NewsletterSection({
  eyebrow = "Join the insider list",
  title = "The insights investors act on — before everyone else does.",
  description = "Off-market listings, market intelligence and expert analysis — delivered straight to your inbox. No noise, no spam.",
}: NewsletterSectionProps) {
  return (
    <Section
      spacing="editorial"
      tone="default"
      aria-labelledby="newsletter-heading"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2.5 font-mono text-xs font-bold tracking-[0.24em] text-muted-foreground uppercase">
              <span aria-hidden className="newsletter-cta__dot" />
              {eyebrow}
            </span>
            <h2
              id="newsletter-heading"
              className="max-w-xl font-display text-3xl leading-[1.08] font-semibold tracking-section-heading text-balance sm:text-4xl lg:text-[2.75rem]"
            >
              {title}
            </h2>
            <p className="max-w-md text-body-small leading-6 text-pretty text-muted-foreground sm:text-base">
              {description}
            </p>
            <ul className="flex flex-wrap gap-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-xs font-semibold text-foreground"
                >
                  <Icon
                    name={benefit.icon}
                    size={15}
                    className="text-primary"
                  />
                  {benefit.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="relative isolate">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="rounded-panel border border-border bg-surface-elevated p-8 shadow-[var(--card-shadow)] sm:p-10">
              <Badge variant="brand" className="w-fit">
                Weekly briefing
              </Badge>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Get the Dexta brief in your inbox
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                One email. Real opportunities. No noise.
              </p>
              <InlineNewsletterForm className="w-full" />
              <p className="mt-4 text-xs text-muted-foreground">
                Join 3,000+ investors and developers already subscribed.
                Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
