"use client";

import { ReactNode } from "react";

/** Clean line icons per section, keyed by route. No emoji, no photos. */
const PATHS: Record<string, ReactNode> = {
  "/roulette": (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
    </>
  ),
  "/gauntlet": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  "/buzzer": (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9M9.5 3h5M12 3v2M18.4 7.2l1.4-1.4" />
    </>
  ),
  "/hoops": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6C10 9 10 15 5.6 18.4M18.4 5.6C14 9 14 15 18.4 18.4" />
    </>
  ),
  "/ragebait": (
    <>
      <path d="M12 3c1.2 3 4 4 4 7.5A4 4 0 0 1 8 10.5c0-1.3.5-2.3 1.2-3 .2 1 .7 1.6 1.4 1.9C10 8 11 5.5 12 3z" />
    </>
  ),
  "/trashtalk": (
    <>
      <path d="M4 10v4h3l6 4V6L7 10H4z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </>
  ),
  "/faith": (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19" />
    </>
  ),
  "/championship": (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5v1a3 3 0 0 0 3 3M16 5h3v1a3 3 0 0 1-3 3M9.5 19h5M12 12.5V19" />
    </>
  ),
};

export default function SectionIcon({ href }: { href: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[href] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}
