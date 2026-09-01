import "server-only";

/**
 * Tracks which source last served the homepage content, so silently and
 * indefinitely serving the site's static content instead of the CMS is
 * observable rather than looking identical to a healthy deploy. Process-
 * local — fine for a single standalone container; a horizontally-scaled
 * deploy would want this in a shared store instead.
 */
export type ContentSource = "cms" | "static" | "unconfigured";

interface ContentSourceState {
  source: ContentSource;
  lastCheckedAt: string;
  lastError: string | null;
}

let state: ContentSourceState = {
  source: "unconfigured",
  lastCheckedAt: new Date(0).toISOString(),
  lastError: null,
};

export function recordContentSourceResult(
  source: ContentSource,
  lastError: string | null = null,
): void {
  state = { source, lastCheckedAt: new Date().toISOString(), lastError };
}

export function getContentSourceState(): ContentSourceState {
  return state;
}
