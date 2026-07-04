import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import GardenAudio from "@/components/GardenAudio";
import HeaderLocation from "@/components/HeaderLocation";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--anton" });
const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const barlow = Barlow_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--barlow",
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
      className={`${anton.variable} ${inter.variable} ${barlow.variable}`}
    >
      <body>
        <header className="nav">
          <Link href="/" className="nav-logo">
            <span className="nav-mark">MSG</span>
            <span className="nav-sub">
              THE MECCA
              <br />
              EST. 1946
            </span>
          </Link>
          <HeaderLocation />
          <GardenAudio />
          <Link href="/" className="nav-home">
            HOME COURT
          </Link>
        </header>
        {children}
        <div className="footer-chant">GO NEW YORK GO NEW YORK GO · BING BONG</div>
        <footer className="court-stripe" aria-hidden="true" />
      </body>
    </html>
  );
}
