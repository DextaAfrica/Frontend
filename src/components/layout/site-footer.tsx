import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { Icon } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";
import { Container } from "./container";

const labelClass =
  "font-display text-xs font-semibold tracking-footer-heading text-brand-light";
const linkListClass =
  "mt-5 flex flex-col gap-3 text-sm tracking-footer text-brand-light/75";
const linkClass =
  "transition-colors duration-[240ms] ease-premium hover:text-brand-light";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark py-16 text-brand-light sm:py-20">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Image
              src="/images/dexta-logo-on-dark.svg"
              alt="Dexta"
              width={238}
              height={104}
            />
            <p className={`mt-8 ${labelClass}`}>Lagos office address</p>
            <p className="mt-4 max-w-xs text-sm leading-6 tracking-footer-copy text-brand-light/75">
              {siteConfig.contact.address}
            </p>
          </div>

          {siteConfig.footer.groups.map((group) => (
            <FooterGroup key={group.title} {...group} />
          ))}

          <div>
            <p className={labelClass}>Contact</p>
            <div className={linkListClass}>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className={linkClass}
              >
                {siteConfig.contact.email}
              </a>
              <a href={`tel:${siteConfig.contact.phone}`} className={linkClass}>
                {siteConfig.contact.phone}
              </a>
              <span>{siteConfig.contact.shortCode}</span>
              <span>{siteConfig.contact.supportLabel}</span>
            </div>
            <p className="mt-8 text-sm tracking-footer-copy text-brand-light/60 normal-case">
              {siteConfig.contact.availability}
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-on-media-border pt-10 sm:mt-20">
          <p className="font-display text-sm font-medium text-brand-light">
            Updates, insights &amp; stories straight to your inbox
          </p>
          <InlineNewsletterForm
            onMedia
            className="mt-4 max-w-newsletter-title"
          />
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-on-media-border pt-8 text-sm tracking-footer-copy text-brand-light/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.legal.registration}</p>
          <div className="flex flex-wrap items-center gap-4">
            <CookieSettingsButton />
            <div className="flex items-center gap-3">
              {siteConfig.social.map((profile) => (
                <a
                  key={profile.label}
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={profile.label}
                  className="footer-social-link grid size-8 place-items-center rounded-full border border-on-media-border text-brand-light transition-colors hover:border-brand-light hover:bg-brand-light/10"
                >
                  <Icon name={profile.icon} size={14} />
                </a>
              ))}
            </div>
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
    <div>
      <p className={labelClass}>{title}</p>
      <nav className={linkListClass}>
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href as Route}
            className={linkClass}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
