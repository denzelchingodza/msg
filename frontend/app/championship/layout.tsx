import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chip '26",
  description:
    "The run, the art, and every parade photo. The reward at the end.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
