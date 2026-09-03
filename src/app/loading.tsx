import Image from "next/image";

/**
 * Next.js's route-level loading UI — shown automatically by the App Router
 * for any navigation whose destination segment isn't ready yet, so this is
 * already "integrated for routing to any page" with no extra wiring.
 *
 * A splash-screen read rather than the old monogram+track: the wordmark up
 * top, four bouncing balls below it in a red↔white brand gradient
 * (`--primary`, `--primary-hover`, `--brand-light`, `--primary-subtle`),
 * each squashing on landing and launching in a staggered wave — the
 * classic Android/Material boot-loader rhythm, in the brand's own palette.
 */
export default function Loading() {
  return (
    <section
      className="app-loader"
      aria-label="Loading Dexta Africa"
      aria-live="polite"
    >
      <span className="app-loader__ambient" aria-hidden />

      <Image
        src="/images/dexta-logo-on-dark.svg"
        alt=""
        width={132}
        height={58}
        priority
        className="app-loader__logo hidden dark:block"
      />
      <Image
        src="/images/dexta-logo.svg"
        alt=""
        width={132}
        height={58}
        priority
        className="app-loader__logo block dark:hidden"
      />

      <span className="app-loader__balls" aria-hidden>
        <span className="app-loader__ball app-loader__ball--a" />
        <span className="app-loader__ball app-loader__ball--b" />
        <span className="app-loader__ball app-loader__ball--c" />
        <span className="app-loader__ball app-loader__ball--d" />
      </span>

      <span className="sr-only">Preparing the next page…</span>
    </section>
  );
}
