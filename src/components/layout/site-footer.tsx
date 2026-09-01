import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { Icon } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { InlineNewsletterForm } from "@/features/newsletter/components/inline-newsletter-form";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark py-16 text-xs text-brand-light sm:py-20">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Image
              src="/images/dexta-logo.svg"
              alt="Dexta"
              width={238}
              height={104}
            />
            <p className="mt-8 tracking-footer uppercase">
              Lagos office address
            </p>
            <p className="mt-4 max-w-xs leading-4 tracking-footer-copy">
              {siteConfig.contact.address}
            </p>
          </div>

          {siteConfig.footer.groups.map((group) => (
            <FooterGroup key={group.title} {...group} />
          ))}

          <div className="tracking-footer uppercase">
            <p className="tracking-footer-heading">Contact</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              <a href={`tel:${siteConfig.contact.phone}`}>
                {siteConfig.contact.phone}
              </a>
              <span>{siteConfig.contact.shortCode}</span>
              <span>{siteConfig.contact.supportLabel}</span>
            </div>
            <p className="mt-12">{siteConfig.contact.availability}</p>
          </div>
        </div>

        <div className="mt-16 border-t border-on-media-border pt-10 sm:mt-20">
          <p className="text-sm font-medium text-brand-light normal-case">
            Updates, insights &amp; stories straight to your inbox
          </p>
          <InlineNewsletterForm
            onMedia
            className="mt-4 max-w-newsletter-title"
          />
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-on-media-border pt-8 tracking-footer-copy sm:flex-row sm:items-center sm:justify-between">
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
                  className="grid size-8 place-items-center rounded-full border border-on-media-border text-brand-light transition-colors hover:border-brand-light hover:bg-brand-light/10"
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
    <div className="tracking-footer uppercase">
      <p className="tracking-footer-heading">{title}</p>
      <nav className="mt-5 flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.label} href={link.href as Route}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
