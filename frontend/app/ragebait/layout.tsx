import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rage Bait",
  description:
    "Hot takes built to end group chats. Rage levels certified.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
