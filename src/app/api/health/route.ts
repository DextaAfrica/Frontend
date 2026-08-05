import { getContentSourceState } from "@/features/home/server/content-source-state";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "healthy",
      service: "dexta-africa-web",
      timestamp: new Date().toISOString(),
      // Informational only — a stale CMS never fails the health check,
      // since fallback content is meant to keep the site serving through
      // an outage. This is what makes that outage observable rather than
      // silent: alert on `homePageContent.source === "fallback"`.
      homePageContent: getContentSourceState(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
