import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const tones = {
  ruby: "from-red-950 via-red-800 to-orange-300",
  stone: "from-stone-900 via-stone-600 to-stone-300",
  dusk: "from-slate-950 via-red-950 to-amber-200",
  light: "from-stone-300 via-red-100 to-white",
} as const;
export function MediaPanel({
  label,
  tone = "ruby",
  src,
  className,
}: {
  label: string;
  tone?: keyof typeof tones;
  src?: string;
  className?: string;
}) {
  return (
    <Reveal
      as="figure"
      role="img"
      aria-label={label}
      className={cn(
        "media-panel relative min-h-72 overflow-hidden rounded-[0.4rem] bg-gradient-to-br",
        tones[tone],
        className,
      )}
    >
      {src && (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-105"
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
      />
      <figcaption className="absolute bottom-5 left-5 text-xs font-medium tracking-[0.15em] text-white/75 uppercase">
        {label}
      </figcaption>
    </Reveal>
  );
}
