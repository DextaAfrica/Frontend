import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { Accent, Icon } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";
import { Container } from "./container";

/**
 * The footer is a deliberate fixed-dark anchor in BOTH themes — the same
 * brand-invariant surface as `CtaBand` / `DextaClanBand`, built on the
 * `--brand-dark` / `--brand-light` tokens rather than the theme-reactive
 * semantic scale. So there is no `useTheme` branch here by design: it renders
 * identically whichever appearance the visitor has chosen. "Following the theme
 * architecture" for this surface means consuming brand/semantic tokens (never
 * raw hex) and letting the one brand red (`--primary`) carry every accent.
 */

const columnHeading =
  "font-display text-[0.7rem] font-semibold tracking-footer-heading text-brand-light/55 uppercase";
const linkList =
  "mt-4 flex flex-col gap-2.5 text-sm tracking-footer text-brand-light/75";
const footerLink = "footer-link w-fit";

export function SiteFooter() {
  const telHref = `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="bg-brand-dark text-brand-light">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-x-12">
          <div className="sm:col-span-3 lg:col-span-1">
            <Image
              src="/images/dexta-logo-on-dark.svg"
              alt={siteConfig.name}
              width={238}
              height={104}
              className="h-10 w-auto"
            />
            <span
              aria-hidden
              className="mt-6 block h-0.5 w-10 rounded-full bg-primary"
            />
            <p className="mt-6 max-w-xs text-sm leading-6 tracking-footer-copy text-brand-light/60">
              {siteConfig.description}
            </p>
            <address className="mt-5 max-w-xs text-sm leading-6 tracking-footer-copy text-brand-light/60 not-italic">
              <span className="block text-brand-light/40">Lagos office</span>
              {siteConfig.contact.address}
            </address>
          </div>

          {siteConfig.footer.groups.map((group) => (
            <FooterGroup key={group.title} {...group} />
          ))}

          <nav aria-label="Contact">
            <h2 className={columnHeading}>Contact</h2>
            <ul className={linkList}>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={footerLink}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={telHref} className={footerLink}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-brand-light/60">
                {siteConfig.contact.shortCode}
              </li>
              <li className="text-brand-light/45">
                {siteConfig.contact.supportLabel}
              </li>
            </ul>
            <p className="mt-4 flex items-center gap-2 text-xs tracking-footer-copy text-brand-light/45">
              <span aria-hidden className="size-1.5 rounded-full bg-success" />
              {siteConfig.contact.availability}
            </p>
          </nav>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-5 border-t border-brand-light/12 pt-10 sm:mt-16 md:grid-cols-2 md:items-center lg:grid-cols-[1fr_minmax(0,30rem)]">
          <div className="max-w-md">
            <h2 className="font-display text-lg leading-snug font-medium text-balance text-brand-light sm:text-xl">
              Updates, insights &amp; stories — straight to your{" "}
              <Accent>inbox</Accent>
            </h2>
            <p className="mt-2 text-sm tracking-footer-copy text-brand-light/50">
              A considered note now and then. No noise, unsubscribe anytime.
            </p>
          </div>
          <InlineNewsletterForm onMedia className="mt-0! w-full" />
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-brand-light/12 pt-8 text-xs tracking-footer-copy text-brand-light/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.legal.registration}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <CookieSettingsButton className="footer-link" />
            <ul className="flex items-center gap-2.5">
              {siteConfig.social.map((profile) => (
                <li key={profile.label}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={profile.label}
                    className="footer-social-link grid size-9 place-items-center rounded-full"
                  >
                    <Icon name={profile.icon} size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: (typeof siteConfig.footer.groups)[number]) {
  return (
    <nav aria-label={title}>
      <h2 className={columnHeading}>{title}</h2>
      <ul className={linkList}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href as Route} className={footerLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
