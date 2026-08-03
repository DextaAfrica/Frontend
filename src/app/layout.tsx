import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant-garamond";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppShell, AppShellMain } from "@/components/layout";
import { siteConfig } from "@/config/site";
import { AppProvider } from "@/providers/app-provider";
import { themeInitializer } from "@/config/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eeeae3" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c0b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AppProvider>
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
