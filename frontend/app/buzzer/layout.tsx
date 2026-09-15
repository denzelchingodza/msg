import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beat the Buzzer",
  description:
    "Rapid-fire Knicks trivia against a 60-second clock. How many can you drain?",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
