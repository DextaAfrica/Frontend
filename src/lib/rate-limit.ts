/**
 * Fixed-window, in-memory rate limiter for public form endpoints.
 *
 * This is per-instance state, not a shared store — fine for a single
 * standalone container. If the app is ever scaled to multiple instances
 * behind a load balancer, swap this for a shared store (e.g. Upstash Redis)
 * so limits are enforced across instances rather than per-instance.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Caps memory from an unbounded number of distinct keys over the process
// lifetime; resetting under sustained load is an acceptable trade-off for
// a form-abuse guard, not a precision rate limiter.
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { windowMs, max }: { windowMs: number; max: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwarded = forwardedFor?.split(",")[0]?.trim();
  return firstForwarded || request.headers.get("x-real-ip") || "unknown";
}
