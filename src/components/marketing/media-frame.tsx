import Image from "next/image";
import { cn } from "@/lib/utils";
import { isRemoteAsset } from "@/lib/media";
import { Reveal } from "./reveal";

export interface MediaFrameProps {
  src: string;
  /** Empty when the image is decorative and an adjacent heading carries the
   *  meaning; a real description otherwise. */
  alt: string;
  /** CSS `aspect-ratio` value — e.g. "4/3", "5/4", "1/1", "16/9". */
  aspect?: string;
  priority?: boolean;
  className?: string;
}

/**
 * A plain framed image — rounded, clipped, on a hairline border, with the same
 * scroll-in <Reveal> and slow hover zoom the rest of the marketing surfaces
 * use. Unlike `MediaPanel` it forces no gradient tone and carries no
 * figcaption, so it drops into an editorial two-column block without
 * decoration competing with the copy beside it.
 */
export function MediaFrame({
  src,
  alt,
  aspect = "4/3",
  priority = false,
  className,
}: MediaFrameProps) {
  return (
    <Reveal
      as="figure"
      className={cn(
        "group/frame relative overflow-hidden rounded-panel border border-border bg-muted",
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 45vw, 100vw"
        priority={priority}
        unoptimized={isRemoteAsset(src)}
        className="object-cover transition-transform duration-[1400ms] ease-premium group-hover/frame:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      />
    </Reveal>
  );
}
