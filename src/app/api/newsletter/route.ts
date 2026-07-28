const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
  } | null;
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.json(
      { message: "Enter a valid email address." },
      { status: 422 },
    );
  }

  // Integration boundary: forward the validated email to the approved CRM/email provider here.
  return Response.json(
    { message: "Subscription received.", email },
    { status: 202 },
  );
}
