"use client";

import * as React from "react";
import { ConsentManager } from "@/components/consent/consent-manager";
import { NewsletterManager } from "@/features/newsletter/components/newsletter-manager";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      {children}
      <ConsentManager />
      <NewsletterManager />
    </ThemeProvider>
  );
}
