import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controller",
  description: "Your phone is the controller for MSG Hoops on the big screen.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
