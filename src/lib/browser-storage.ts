"use client";

// Browsers may deny Storage access in private, embedded, or hardened contexts.
// This in-memory store keeps the application working for the current page
// lifetime when that happens.
const memoryStore = new Map<string, string>();

export function readBrowserStorage(key: string) {
  try {
    return window.localStorage.getItem(key) ?? memoryStore.get(key) ?? null;
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

export function writeBrowserStorage(key: string, value: string) {
  memoryStore.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The in-memory store above already preserves this for the page lifetime.
  }
}

export function removeBrowserStorage(key: string) {
  memoryStore.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    // There is no persistent value to remove when Storage is unavailable.
  }
}
