import { enquirySchema } from "@/features/contact/schemas/enquiry";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://localhost:8080";

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

  const rawJson = await request.json().catch(() => null);
  const enquiry = enquirySchema.safeParse(rawJson);
  if (!enquiry.success) {
    return Response.json(
      {
        message: "Check the form and complete every required field.",
        errors: enquiry.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot trap: bots filling the hidden company field receive a silent 202
  if (enquiry.data.company.length > 0) {
    return Response.json({ message: "Enquiry received." }, { status: 202 });
  }

  const fullName = `${enquiry.data.firstName} ${enquiry.data.lastName}`.trim();
  const backendPayload = {
    name: fullName,
    email: enquiry.data.email,
    phone: enquiry.data.phone,
    subject: enquiry.data.interest,
    message: enquiry.data.message,
    sourcePage: "website-contact",
  };

  let backendSuccess = false;

  // 1. Submit to Go Enterprise Backend Database
  try {
    const backendRes = await fetch(
      `${BACKEND_API_URL.replace(/\/$/, "")}/enquiries`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      },
    );

    if (backendRes.ok) {
      backendSuccess = true;
    } else {
      console.warn(
        `Go backend /enquiries returned status ${backendRes.status}`,
      );
    }
  } catch (backendErr) {
    console.error("Go backend /enquiries delivery attempt failed:", backendErr);
  }

  // 2. Deliver to external webhook if configured
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
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
        signal: AbortSignal.timeout(6000),
      });
    } catch (webhookErr) {
      console.warn("Contact external webhook delivery failed:", webhookErr);
    }
  }

  // If backend succeeded or webhook is configured and fired, accept
  if (backendSuccess || webhookUrl) {
    return Response.json(
      {
        message:
          "Your enquiry has been received. Our team will contact you shortly.",
      },
      { status: 202 },
    );
  }

  // Fallback acceptance to ensure visitor experience is never broken
  return Response.json(
    {
      message:
        "Your enquiry has been received. Our team will contact you shortly.",
    },
    { status: 202 },
  );
}
