"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "@/lib/sections";

/**
 * The concourse: walk left, walk right, or jump to any section.
 * Lives at the bottom of every section page so nobody gets lost.
 */
export default function Concourse() {
  const path = usePathname();
  const i = SECTIONS.findIndex((s) => s.href === path);
  if (i === -1) return null;

  const prev = SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length];
  const next = SECTIONS[(i + 1) % SECTIONS.length];

  return (
    <nav className="concourse" aria-label="Section navigation">
      <Link href={prev.href} className="walk">
        <span className="walk-dir">← WALK LEFT</span>
        <b>{prev.title}</b>
      </Link>
      <div className="concourse-map">
        {SECTIONS.map((s, j) => (
          <Link
            key={s.href}
            href={s.href}
            className={`spot ${j === i ? "here" : ""}`}
            title={`${s.title} (${s.spot})`}
          >
            {s.n}
          </Link>
        ))}
        <Link href="/" className="spot home" title="Home court">
          ⌂
        </Link>
      </div>
      <Link href={next.href} className="walk right">
        <span className="walk-dir">WALK RIGHT →</span>
        <b>{next.title}</b>
      </Link>
    </nav>
  );
}
