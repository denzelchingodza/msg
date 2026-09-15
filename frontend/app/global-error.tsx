"use client";

/**
 * Last-resort boundary: catches errors in the root layout itself, so it must
 * render its own <html>/<body>. Styles are inlined because globals.css and the
 * fonts may not have loaded at this point.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#040e26",
          color: "#f5f7fa",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <p
            style={{
              color: "#f58426",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
            }}
          >
            Whistle blown
          </p>
          <h1
            style={{
              fontSize: 88,
              lineHeight: 1,
              margin: "8px 0 4px",
              color: "#f58426",
              fontFamily: "Impact, sans-serif",
            }}
          >
            TO
          </h1>
          <p style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>
            Turnover.
          </p>
          <p style={{ color: "#8c9bb4", lineHeight: 1.5, margin: "0 0 22px" }}>
            The whole floor went dark for a second. Reload and we&apos;ll tip it
            off again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#f58426",
              color: "#040e26",
              border: "none",
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Run it back
          </button>
          {error?.digest && (
            <p style={{ color: "#8c9bb4", fontSize: 12, marginTop: 18 }}>
              Ref code {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
