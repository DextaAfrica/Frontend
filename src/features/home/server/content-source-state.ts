import "server-only";

/**
 * Tracks whether the last homepage content fetch actually reached the CMS,
 * so a silent, indefinite fallback is observable instead of looking
 * identical to a healthy deploy. Process-local — fine for a single
 * standalone container; a horizontally-scaled deploy would want this in a
 * shared store instead.
 */
export type ContentSource = "cms" | "fallback" | "unconfigured";

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
