"use client";

import { usePathname } from "next/navigation";
import GardenAudio from "@/components/GardenAudio";
import SiteFooter from "@/components/SiteFooter";

/** Bottom-of-page chrome (crowd toggle, footer), hidden on /play/*. */
export default function ChromeBottom() {
  const pathname = usePathname();
  if (pathname?.startsWith("/play")) return null;
  return (
    <>
      <div className="crowd-float">
        <GardenAudio />
      </div>
      <SiteFooter />
      <div className="court-stripe" aria-hidden="true" />
    </>
  );
}
