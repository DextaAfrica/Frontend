import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/consent-manager";
import { siteConfig } from "@/config/site";
import { NewsletterButton } from "@/features/newsletter/components/newsletter-manager";
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

        <div className="mt-16 flex flex-col gap-5 border-t border-on-media-border pt-8 tracking-footer-copy sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.legal.registration}</p>
          <div className="flex flex-wrap gap-4">
            <CookieSettingsButton />
            <NewsletterButton />
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
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
