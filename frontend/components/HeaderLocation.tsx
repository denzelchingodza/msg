"use client";

import { usePathname } from "next/navigation";
import { sectionFor } from "@/lib/sections";

/** Always tells you where you are in the building. */
export default function HeaderLocation() {
  const path = usePathname();
  const section = sectionFor(path);

  if (!section) {
    return <span className="nav-champ">🏆 2026 NBA CHAMPIONS</span>;
  }
  return (
    <span className="nav-loc">
      <i>YOU ARE AT</i>
      {section.spot} · {section.title}
    </span>
  );
}
