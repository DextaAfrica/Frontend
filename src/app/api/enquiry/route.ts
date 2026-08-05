import { enquirySchema } from "@/features/contact/schemas/enquiry";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `enquiry:${getClientIp(request)}`,
    { windowMs: 10 * 60_000, max: 5 },
  );
  if (!allowed) {
    return Response.json(
      { message: "Too many enquiries submitted. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const enquiry = enquirySchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!enquiry.success) {
    return Response.json(
      { message: "Check the form and complete every required field." },
      { status: 422 },
    );
  }
  if (enquiry.data.company.length > 0) {
    return Response.json({ message: "Enquiry received." }, { status: 202 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("CONTACT_WEBHOOK_URL is not configured.");
    return Response.json(
      { message: "The enquiry service is temporarily unavailable." },
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
        event: "contact.enquiry_submitted",
        firstName: enquiry.data.firstName,
        lastName: enquiry.data.lastName,
        email: enquiry.data.email,
        phone: enquiry.data.phone,
        interest: enquiry.data.interest,
        message: enquiry.data.message,
        consent: enquiry.data.consent,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error(`Contact webhook returned ${response.status}`);
    }
    return Response.json({ message: "Enquiry received." }, { status: 202 });
  } catch (error) {
    console.error("Enquiry delivery failed", error);
    return Response.json(
      { message: "We could not submit your enquiry. Please try again." },
      { status: 502 },
    );
  }
}
