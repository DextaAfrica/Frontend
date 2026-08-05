"use client";

// Browsers may deny Storage access in private, embedded, or hardened contexts.
// Keep the application functional for the current page lifetime in that case.
const memoryFallback = new Map<string, string>();

export function readBrowserStorage(key: string) {
  try {
    return window.localStorage.getItem(key) ?? memoryFallback.get(key) ?? null;
  } catch {
    return memoryFallback.get(key) ?? null;
  }
}

export function writeBrowserStorage(key: string, value: string) {
  memoryFallback.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The in-memory fallback preserves behavior for the current page lifetime.
  }
}

export function removeBrowserStorage(key: string) {
  memoryFallback.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // There is no persistent value to remove when Storage is unavailable.
  }
}
