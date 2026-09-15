import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trash Talk",
  description:
    "Pick any of the other 29 teams and receive ammunition.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
