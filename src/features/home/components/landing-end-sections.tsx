import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { EditorialEyebrow, EditorialHeading } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";

export function NewsletterSection() {
  return (
    <Section spacing="md" tone="surface">
      <div className="relative overflow-hidden rounded-2xl bg-muted px-6 py-10 sm:px-12 sm:py-12">
        <div className="relative z-10 max-w-[33.25rem]">
          <EditorialEyebrow className="text-muted-foreground">
            Stay informed
          </EditorialEyebrow>
          <EditorialHeading className="text-newsletter-title mt-4 max-w-newsletter-title">
            Get the latest updates from Dexta
          </EditorialHeading>
          <InlineNewsletterForm />
        </div>
        <div
          aria-hidden
          className="absolute top-16 right-[-1.5rem] hidden h-72 w-[43rem] md:block"
        >
          {[0, 1, 2, 3, 4].map((item) => (
            <span
              key={item}
              className="newsletter-stack-card absolute h-newsletter-card w-newsletter-card rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-brand-dark py-20 text-xs text-brand-light">
      <Container>
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Image
              src="/images/dexta-logo.svg"
              alt="Dexta"
              width={238}
              height={104}
            />
            <p className="mt-8 tracking-[0.2em] uppercase">
              Lagos office address
            </p>
            <p className="mt-4 max-w-[19rem] leading-4 tracking-[0.05em]">
              {siteConfig.contact.address}
            </p>
          </div>
          <FooterGroup
            title="Company"
            links={[
              ["About us", "/about"],
              ["FAQ", "/about"],
            ]}
          />
          <FooterGroup
            title="Legal"
            links={[
              ["Privacy Policy", "/privacy"],
              ["Project Delivery", "/terms"],
              ["Terms of Use", "/terms"],
              ["Refund Policy", "/terms"],
            ]}
          />
          <div className="tracking-[0.2em] uppercase">
            <p className="tracking-[0.25em]">Contact</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              <a href={`tel:${siteConfig.contact.phone}`}>
                {siteConfig.contact.phone}
              </a>
              <span>0700-DEXTA-AFRICA</span>
              <span>X Support</span>
            </div>
            <p className="mt-12">Our lines are available 24/7</p>
          </div>
        </div>
        <div className="mt-16 border-t border-white/50 pt-8 tracking-[0.02em]">
          © Dexta Africa Limited is Registered with LASERA
        </div>
      </Container>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div className="tracking-[0.2em] uppercase">
      <p className="tracking-[0.25em]">{title}</p>
      <nav className="mt-5 flex flex-col gap-2">
        {links.map(([label, href]) => (
          <Link key={label} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
