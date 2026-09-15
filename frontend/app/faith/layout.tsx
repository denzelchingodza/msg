import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Faith",
  description:
    "The whole Knicks story, 1946 to the parade. For fans and the unconverted.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
