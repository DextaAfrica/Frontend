import { ButtonLink, Icon } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface ContactMapProps {
  /** The full postal address, used both to query the map and to display on
   *  the floating card. */
  address: string;
  /** Shown above the address on the floating card (e.g. a location label
   *  distinct from the postal address itself). */
  label?: string;
  className?: string;
}

/**
 * A real, interactive Google Map — not a static photo standing in for one.
 * Works today with zero configuration (Google's classic keyless embed,
 * `maps?...&output=embed`, no API key required) and upgrades itself
 * automatically the moment `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set to the
 * officially supported Maps Embed API — same component, same markup,
 * nothing else to change here when that key is plugged in.
 *
 * A frosted glass card floats over the map's bottom-left corner carrying
 * the address and a "Get directions" link straight into Google Maps — the
 * same glass recipe (soft top-edge highlight, deep drop shadow, heavy
 * blur+saturate) used elsewhere on the site for a card sitting on top of
 * imagery, so this reads as a considered UI shell around the map rather
 * than a raw, unstyled embed.
 */
export function ContactMap({ address, label, className }: ContactMapProps) {
  const query = encodeURIComponent(address);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`
    : `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div
      className={cn(
        "contact-map relative overflow-hidden rounded-panel border border-border bg-muted",
        className,
      )}
    >
      <iframe
        src={src}
        title={`Map showing ${address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="contact-map__frame absolute inset-0 size-full"
      />

      <div className="contact-map-card absolute bottom-4 left-4 z-10 flex max-w-sm flex-col gap-3 p-5 sm:bottom-6 sm:left-6 sm:p-6">
        <span className="flex items-center gap-2 text-status tracking-project-status text-on-media/80 uppercase">
          <Icon name="pin" size={14} />
          {label ?? "Our office"}
        </span>
        <p className="text-sm leading-relaxed text-on-media">{address}</p>
        <ButtonLink
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          className="w-fit"
        >
          Get directions
          <Icon name="arrow-right" />
        </ButtonLink>
      </div>
    </div>
  );
}
