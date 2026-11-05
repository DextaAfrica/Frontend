import { newsletterSubscriptionSchema } from "@/features/newsletter/schemas/subscription";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:8080";

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `newsletter:${getClientIp(request)}`,
    { windowMs: 10 * 60_000, max: 5 },
  );
  if (!allowed) {
    return Response.json(
      { message: "Too many attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const rawJson = await request.json().catch(() => null);
  const subscription = newsletterSubscriptionSchema.safeParse(rawJson);
  if (!subscription.success) {
    return Response.json(
      {
        message: "Enter a valid email address.",
        errors: subscription.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot trap: spam bots filling the hidden company field receive a silent 202
  if (subscription.data.company.length > 0) {
    return Response.json(
      { message: "Subscription received." },
      { status: 202 },
    );
  }

  let backendSuccess = false;

  // 1. Submit to Go Enterprise Backend Newsletter Service
  try {
    const backendRes = await fetch(
      `${BACKEND_API_URL.replace(/\/$/, "")}/newsletter/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscription.data.email }),
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      },
    );

    if (backendRes.ok || backendRes.status === 409) {
      // 200/201 or 409 Conflict (already subscribed) are treated as success
      backendSuccess = true;
    }
  } catch (backendErr) {
    console.error("Go backend newsletter subscription failed:", backendErr);
  }

  // 2. Secondary Webhook delivery if configured
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEWSLETTER_WEBHOOK_TOKEN
            ? {
                Authorization: `Bearer ${process.env.NEWSLETTER_WEBHOOK_TOKEN}`,
              }
            : {}),
        },
        body: JSON.stringify({
          event: "newsletter.subscribed",
          email: subscription.data.email,
          source: subscription.data.source,
          consent: subscription.data.consent,
          subscribedAt: new Date().toISOString(),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
    } catch (webhookErr) {
      console.warn("Newsletter external webhook delivery failed:", webhookErr);
    }
  }

  if (backendSuccess || webhookUrl) {
    return Response.json(
      { message: "Thank you for subscribing to Dexta Africa Journal." },
      { status: 202 },
    );
  }

  return Response.json(
    { message: "Thank you for subscribing to Dexta Africa Journal." },
    { status: 202 },
  );
}
