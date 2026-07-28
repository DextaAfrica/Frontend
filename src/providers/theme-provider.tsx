"use client";

import * as React from "react";
import { THEME_STORAGE_KEY } from "@/config/theme";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = React.useState<Theme>(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );
  const toggleTheme = React.useCallback(
    () =>
      setTheme((current) => {
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        document.documentElement.style.colorScheme = next;
        localStorage.setItem(THEME_STORAGE_KEY, next);
        return next;
      }),
    [],
  );
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
