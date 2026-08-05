import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATION_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || !authorization || !safeCompare(authorization, `Bearer ${secret}`)) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  revalidateTag("home-page", "max");
  return Response.json({ revalidated: true, tag: "home-page" });
}
