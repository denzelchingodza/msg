"use client";

import { usePathname } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import Tactile from "@/components/Tactile";
import WakeGate from "@/components/WakeGate";

/** Top-of-page chrome, hidden on the phone-controller route (/play/*). */
export default function ChromeTop() {
  const pathname = usePathname();
  if (pathname?.startsWith("/play")) return null;
  return (
    <>
      <WakeGate />
      <Tactile />
      <SiteNav />
    </>
  );
}
