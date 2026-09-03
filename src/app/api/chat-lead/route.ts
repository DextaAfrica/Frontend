import { chatLeadSchema } from "@/features/chat/schemas/chat-lead";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

/**
 * The chat widget's mini message form. Mirrors `/api/enquiry` — rate limit,
 * honeypot, forward to the same `CONTACT_WEBHOOK_URL` (a distinct `event` name
 * lets the receiver route it) — with the looser `chatLeadSchema`.
 */
export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `chat-lead:${getClientIp(request)}`,
    { windowMs: 10 * 60_000, max: 8 },
  );
  if (!allowed) {
    return Response.json(
      { message: "Too many messages sent. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const lead = chatLeadSchema.safeParse(await request.json().catch(() => null));
  if (!lead.success) {
    return Response.json(
      { message: "Add your name, a way to reach you, and a message." },
      { status: 422 },
    );
  }
  if (lead.data.company.length > 0) {
    return Response.json({ message: "Message received." }, { status: 202 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("CONTACT_WEBHOOK_URL is not configured.");
    return Response.json(
      { message: "The message service is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        event: "chat.message_submitted",
        name: lead.data.name,
        contact: lead.data.contact,
        message: lead.data.message,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`Contact webhook returned ${response.status}`);
    }
    return Response.json({ message: "Message received." }, { status: 202 });
  } catch (error) {
    console.error("Chat message delivery failed", error);
    return Response.json(
      { message: "We could not send your message. Please try again." },
      { status: 502 },
    );
  }
}
