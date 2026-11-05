import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

const ALLOWED_TAGS = new Set([
  "home-page",
  "portfolio",
  "journal",
  "careers",
  "content",
]);

export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATION_SECRET;
  const authorization = request.headers.get("authorization");

  if (
    !secret ||
    !authorization ||
    !safeCompare(authorization, `Bearer ${secret}`)
  ) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const requestedTag =
    (typeof body.tag === "string" && body.tag) ||
    url.searchParams.get("tag") ||
    "home-page";

  const tagsToRevalidate = Array.isArray(body.tags)
    ? (body.tags as string[])
    : [requestedTag];

  const revalidated: string[] = [];

  for (const tag of tagsToRevalidate) {
    // Only permit safe, known tag namespaces
    const baseTag = tag.split("-")[0];
    if (ALLOWED_TAGS.has(tag) || (baseTag && ALLOWED_TAGS.has(baseTag))) {
      revalidateTag(tag, "max");
      revalidated.push(tag);
    }
  }

  if (revalidated.length === 0) {
    revalidateTag("home-page", "max");
    revalidated.push("home-page");
  }

  return Response.json({
    revalidated: true,
    tags: revalidated,
    timestamp: new Date().toISOString(),
  });
}
