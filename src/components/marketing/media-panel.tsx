import { cn } from "@/lib/utils";

const tones = {
  ruby: "from-red-950 via-red-800 to-orange-300",
  stone: "from-stone-900 via-stone-600 to-stone-300",
  dusk: "from-slate-950 via-red-950 to-amber-200",
  light: "from-stone-300 via-red-100 to-white",
} as const;
export function MediaPanel({
  label,
  tone = "ruby",
  className,
}: {
  label: string;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <figure
      role="img"
      aria-label={label}
      className={cn(
        "relative min-h-72 overflow-hidden rounded-3xl bg-gradient-to-br",
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,.18)_50%,transparent_65%)] transition-transform duration-1000 hover:translate-x-1/3"
      />
      <figcaption className="absolute bottom-5 left-5 text-xs font-bold tracking-[0.15em] text-white/75 uppercase">
        {label}
      </figcaption>
    </figure>
  );
}
