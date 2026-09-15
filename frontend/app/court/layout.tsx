import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Court",
  description:
    "The main floor of the Mecca. Pick your spot and start ballin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
