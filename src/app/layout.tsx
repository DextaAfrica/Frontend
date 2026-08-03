import type { Metadata, Viewport } from "next";
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
    { media: "(prefers-color-scheme: light)", color: "#f8f8f7" },
    { media: "(prefers-color-scheme: dark)", color: "#060606" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
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
