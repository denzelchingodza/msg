import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Gauntlet",
  description:
    "Ten trivia questions. Right answers get praised, wrong ones get roasted.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
