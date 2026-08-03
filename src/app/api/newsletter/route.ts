const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    company?: unknown;
    source?: unknown;
    consent?: unknown;
  } | null;
  if (typeof body?.company === "string" && body.company.length > 0) {
    return Response.json(
      { message: "Subscription received." },
      { status: 202 },
    );
  }
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 422 },
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
    email,
    source: typeof body?.source === "string" ? body.source : "website",
    consent: typeof body?.consent === "object" ? body.consent : null,
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
