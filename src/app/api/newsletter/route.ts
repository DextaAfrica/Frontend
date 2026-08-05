import { newsletterSubscriptionSchema } from "@/features/newsletter/schemas/subscription";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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

  const subscription = newsletterSubscriptionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!subscription.success) {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 422 },
    );
  }
  if (subscription.data.company.length > 0) {
    return Response.json(
      { message: "Subscription received." },
      { status: 202 },
    );
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("NEWSLETTER_WEBHOOK_URL is not configured.");
    return Response.json(
      { message: "The subscription service is temporarily unavailable." },
      { status: 503 },
    );
  }

  const payload = {
    event: "newsletter.subscribed",
    email: subscription.data.email,
    source: subscription.data.source,
    consent: subscription.data.consent,
    subscribedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_WEBHOOK_TOKEN
          ? {
              Authorization: `Bearer ${process.env.NEWSLETTER_WEBHOOK_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      throw new Error(`Newsletter webhook returned ${response.status}`);
    return Response.json(
      { message: "Subscription received." },
      { status: 202 },
    );
  } catch (error) {
    console.error("Newsletter delivery failed", error);
    return Response.json(
      {
        message: "We could not complete the subscription. Please try again.",
      },
      { status: 502 },
    );
  }
}
