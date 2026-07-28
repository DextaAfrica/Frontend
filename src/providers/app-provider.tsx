"use client";

import * as React from "react";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProvider({ children }: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
