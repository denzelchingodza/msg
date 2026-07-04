"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/roulette", "Roulette"],
  ["/ragebait", "Rage Bait"],
  ["/gauntlet", "Gauntlet"],
  ["/trashtalk", "Trash Talk"],
  ["/championship", "Chip '26"],
  ["/faith", "The Faith"],
] as const;

export default function NavLinks() {
  const path = usePathname();
  return (
    <div className="nav-links">
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={path === href ? "active" : ""}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
