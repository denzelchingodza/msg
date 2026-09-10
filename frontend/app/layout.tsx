import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Graduate, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "MSG, The Mecca In App Form",
  description:
    "A New York Knicks shrine: fact roulette, rage bait, trivia gauntlet, trash talk, and the 2026 championship. Bing bong.",
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
      </body>
    </html>
  );
}
