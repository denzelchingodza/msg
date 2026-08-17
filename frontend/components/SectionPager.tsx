"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/sections";

/** The walk through the building, in order. Home first, then every section. */
const TOUR = [
  { href: "/court", title: "Home Court" },
  ...SECTIONS.map((s) => ({ href: s.href, title: s.title })),
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export default function SectionPager() {
  const pathname = usePathname();
  const idx = TOUR.findIndex((t) => t.href === pathname);
  if (idx === -1) return null; // welcome screen / unknown route — no pager

  const prev = idx > 0 ? TOUR[idx - 1] : null;
  const next = idx < TOUR.length - 1 ? TOUR[idx + 1] : null;
  const cur = TOUR[idx];

  return (
    <nav className="pager" aria-label="Page navigation">
      {prev ? (
        <Link href={prev.href} className="pager-side prev" aria-label={`Previous: ${prev.title}`}>
          <Chevron dir="left" />
          <span className="pager-name">{prev.title}</span>
        </Link>
      ) : (
        <span className="pager-side disabled" aria-hidden="true"><Chevron dir="left" /></span>
      )}

      <span className="pager-current" aria-current="page">{cur.title}</span>

      {next ? (
        <Link href={next.href} className="pager-side next" aria-label={`Next: ${next.title}`}>
          <span className="pager-name">{next.title}</span>
          <Chevron dir="right" />
        </Link>
      ) : (
        <span className="pager-side disabled" aria-hidden="true"><Chevron dir="right" /></span>
      )}
    </nav>
  );
}
