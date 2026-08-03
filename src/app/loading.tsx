export default function Loading() {
  return (
    <section
      className="app-loader"
      aria-label="Loading Dexta Africa"
      aria-live="polite"
    >
      <span className="app-loader__ambient" aria-hidden />
      <span className="app-loader__mark" aria-hidden>
        MR
      </span>
      <span className="app-loader__name">Dexta Africa</span>
      <span className="app-loader__track" aria-hidden>
        <span />
      </span>
      <span className="sr-only">Preparing the next page…</span>
    </section>
  );
}
