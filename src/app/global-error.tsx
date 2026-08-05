"use client";

import { THEME_COLORS } from "@/config/theme";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: 24,
            fontFamily: "system-ui",
          }}
        >
          <section style={{ maxWidth: 560, textAlign: "center" }}>
            <p style={{ color: THEME_COLORS.destructive, fontWeight: 700 }}>
              APPLICATION ERROR
            </p>
            <h1>We couldn’t load the experience.</h1>
            <p>Please retry. If the problem continues, contact our team.</p>
            <button
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 8,
                padding: "12px 18px",
                background: THEME_COLORS.destructive,
                color: THEME_COLORS.destructiveForeground,
                fontWeight: 700,
              }}
            >
              Reload application
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
