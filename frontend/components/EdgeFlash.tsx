"use client";

/**
 * A full-screen border flash — green on a correct answer, red on a wrong one.
 * Bump `pulse` (a counter) each answer to retrigger the animation via the key.
 */
export default function EdgeFlash({
  tone,
  pulse,
}: {
  tone: "correct" | "wrong" | null;
  pulse: number;
}) {
  if (!tone) return null;
  return <div key={pulse} className={`edge-flash ${tone}`} aria-hidden="true" />;
}
