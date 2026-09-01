import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/playfair-display/wght-italic.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppShell, AppShellMain } from "@/components/layout";
import { Cursor } from "@/components/ui/cursor";
import { siteConfig } from "@/config/site";
import { AppProvider } from "@/providers/app-provider";
import { THEME_COLORS, themeInitializer } from "@/config/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1600, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address,
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
};

export const viewport: Viewport = {
  // Next.js only auto-fills these when no viewport export exists at all —
  // once a layout provides its own (for themeColor here), it owns the
  // whole meta tag, so width/initialScale must be declared explicitly or
  // browsers fall back to their own (usually wrong) defaults.
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AppProvider>
          <Cursor />
          <AppShell>
            <SiteHeader />
            <AppShellMain>{children}</AppShellMain>
            <SiteFooter />
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
