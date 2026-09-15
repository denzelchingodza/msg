import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MSG Hoops",
  description:
    "Flick to shoot. Sixty seconds versus a rival, streaks, heat, and a moving rim when you catch fire. Play with your phone as the controller.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
