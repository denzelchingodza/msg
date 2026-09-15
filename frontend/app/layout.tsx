import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Graduate, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ChromeBottom from "@/components/ChromeBottom";
import ChromeTop from "@/components/ChromeTop";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--anton" });
const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const barlow = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--barlow",
});
const graduate = Graduate({
  weight: "400",
  subsets: ["latin"],
  variable: "--graduate",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://msg-coral.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MSG, The Mecca in App Form",
    template: "%s · MSG",
  },
  description:
    "A New York Knicks shrine: fact roulette, rage bait, trivia gauntlet, trash talk, MSG Hoops, and the 2026 championship. Bing bong.",
  applicationName: "MSG",
  keywords: [
    "New York Knicks",
    "Knicks",
    "MSG",
    "Madison Square Garden",
    "Knicks trivia",
    "Knicks games",
    "2026 championship",
  ],
  authors: [{ name: "Denzel" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MSG",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "MSG · The Mecca, in app form",
    title: "MSG, The Mecca in App Form",
    description:
      "Knicks facts, games, trash talk, MSG Hoops, and the 2026 championship. Bing bong.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSG, The Mecca in App Form",
    description:
      "Knicks facts, games, trash talk, MSG Hoops, and the 2026 championship. Bing bong.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#040e26",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${barlow.variable} ${graduate.variable}`}
    >
      <body>
        <ChromeTop />
        {children}
        <ChromeBottom />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
