"use client";

import * as React from "react";
import { THEME_STORAGE_KEY } from "@/config/theme";
import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const THEME_CHANGE_EVENT = "dexta:theme-change";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemePreference) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  root.dataset.themePreference = theme;
  root.style.colorScheme = resolved;
  return resolved;
}

function getThemeSnapshot(): ThemePreference {
  const stored = readBrowserStorage(THEME_STORAGE_KEY);
  return isThemePreference(stored) ? stored : "system";
}

function getResolvedThemeSnapshot(): ResolvedTheme {
  return resolveTheme(getThemeSnapshot());
}

function subscribeToTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const syncTheme = () => {
    applyTheme(getThemeSnapshot());
    callback();
  };
  const syncStoredTheme = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) syncTheme();
  };

  window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
  window.addEventListener("storage", syncStoredTheme);
  media.addEventListener("change", syncTheme);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.removeEventListener("storage", syncStoredTheme);
    media.removeEventListener("change", syncTheme);
  };
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const theme = React.useSyncExternalStore<ThemePreference>(
    subscribeToTheme,
    getThemeSnapshot,
    () => "system",
  );
  const resolvedTheme = React.useSyncExternalStore<ResolvedTheme>(
    subscribeToTheme,
    getResolvedThemeSnapshot,
    () => "light",
  );

  const setTheme = React.useCallback((preference: ThemePreference) => {
    writeBrowserStorage(THEME_STORAGE_KEY, preference);
    applyTheme(preference);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
