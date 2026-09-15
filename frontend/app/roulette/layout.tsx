import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fact Roulette",
  description:
    "Press one button, get a Knicks fact. Rare pulls rain confetti.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
