import { Cluster, Container, Stack } from "@/components/layout";
import { ButtonLink, Icon } from "@/components/ui";

export function CinematicHero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/maison-hero.png"
        aria-hidden="true"
        className="hero-media absolute inset-0 size-full object-cover"
      >
        <source
          media="(max-width: 767px)"
          src="/media/maison-hero-mobile.mp4"
          type="video/mp4"
        />
        <source src="/media/maison-hero-premium.mp4" type="video/mp4" />
      </video>
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(186,94,52,.10),transparent_35%),linear-gradient(90deg,rgba(5,3,3,.58)_0%,rgba(5,3,3,.24)_48%,rgba(5,3,3,.04)_78%),linear-gradient(0deg,rgba(5,3,3,.56)_0%,transparent_48%)]"
      />
      <Container className="relative pb-16 sm:pb-20 lg:pb-24">
        <Stack gap="lg" align="start" className="max-w-5xl" data-reveal>
          <p className="text-[0.68rem] font-medium tracking-[0.24em] text-white/70 uppercase">
            Maison Rouge · Private residences
          </p>
          <h1 className="max-w-5xl text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.88] font-light tracking-[-0.055em] text-balance">
            Iconic has
            <br />
            <em className="font-serif font-light text-red-300">
              a new address.
            </em>
          </h1>
          <p className="max-w-xl text-base leading-7 font-light text-white/72 sm:text-lg">
            Considered residences where architecture, landscape, and a life
            beautifully lived exist in complete harmony.
          </p>
          <Cluster>
            <ButtonLink href="/portfolio" size="lg" className="px-7">
              Explore the collection <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink
              href="/about"
              size="lg"
              variant="ghost"
              className="border border-white/30 text-white hover:bg-white/10"
            >
              Our philosophy
            </ButtonLink>
          </Cluster>
          <span
            aria-hidden
            className="mt-2 flex w-[min(24rem,72vw)] items-center gap-3"
          >
            <span className="h-px flex-1 overflow-hidden bg-white/25">
              <span className="hero-progress block h-full bg-white" />
            </span>
            <span className="text-[0.58rem] tracking-[0.16em] text-white/55 uppercase">
              Architecture · Interiors · Life
            </span>
          </span>
        </Stack>
      </Container>
      <span className="absolute right-6 bottom-8 hidden items-center gap-3 text-[0.65rem] tracking-[0.2em] text-white/60 uppercase md:flex">
        <span className="h-px w-12 bg-white/40" />
        Scroll to explore
      </span>
    </section>
  );
}
