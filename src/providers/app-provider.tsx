"use client";

import * as React from "react";
import { ChatWidget } from "@/components/chat";
import { ConsentManager } from "@/components/consent/consent-manager";
import { NewsletterManager } from "@/features/newsletter/components/newsletter-manager";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      {children}
      <ChatWidget />
      <ConsentManager />
      <NewsletterManager />
    </ThemeProvider>
  );
}
