// @vitest-environment jsdom

import * as React from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/config/theme";
import { ThemeProvider, useTheme } from "./theme-provider";

function ThemeState() {
  const { theme, resolvedTheme } = useTheme();
  return <output>{`${theme}:${resolvedTheme}`}</output>;
}

let systemPrefersDark = false;
const mediaListeners = new Set<EventListener>();

describe("ThemeProvider hydration", () => {
  beforeEach(() => {
    systemPrefersDark = false;
    mediaListeners.clear();
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    const values = new Map<string, string>();
    const storage: Storage = {
      get length() {
        return values.size;
      },
      clear: () => values.clear(),
      getItem: (key) => values.get(key) ?? null,
      key: (index) => [...values.keys()][index] ?? null,
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => values.set(key, value),
    };
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: storage,
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) =>
        ({
          get matches() {
            return systemPrefersDark;
          },
          media: query,
          onchange: null,
          addEventListener: (
            _event: string,
            listener: EventListenerOrEventListenerObject,
          ) => {
            if (typeof listener === "function") mediaListeners.add(listener);
          },
          removeEventListener: (
            _event: string,
            listener: EventListenerOrEventListenerObject,
          ) => {
            if (typeof listener === "function") mediaListeners.delete(listener);
          },
          addListener: () => undefined,
          removeListener: () => undefined,
          dispatchEvent: () => true,
        }) satisfies MediaQueryList,
    });
  });

  afterEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-preference");
    window.localStorage.clear();
    document.body.innerHTML = "";
  });

  it("hydrates without recoverable errors when the stored theme is dark", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    document.documentElement.classList.add("dark");
    const application = (
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(application);
    document.body.append(container);
    const recoverableErrors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, application, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
    });

    expect(recoverableErrors).toEqual([]);
    expect(container.textContent).toBe("dark:dark");

    await act(async () => root?.unmount());
  });

  it("tracks operating-system changes when the preference is system", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const application = (
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>
    );
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      container.innerHTML = renderToString(application);
      root = hydrateRoot(container, application);
    });
    expect(container.textContent).toBe("system:light");

    await act(async () => {
      systemPrefersDark = true;
      mediaListeners.forEach((listener) => listener(new Event("change")));
    });

    expect(container.textContent).toBe("system:dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await act(async () => root?.unmount());
  });
});
