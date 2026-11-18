import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Atharva Gupta — Software Engineer · Backend & AI Infrastructure",
  description:
    "Atharva Gupta is a software engineer building scalable backends, distributed systems and production AI infrastructure. Cut AI platform latency by 55% with multi-provider routing, caching and failover.",
  keywords: ["Atharva Gupta", "Software Engineer", "Backend Engineer", "Distributed Systems", "AI Infrastructure", "Node.js", "Kubernetes", "Indore"],
  authors: [{ name: "Atharva Gupta" }],
  openGraph: {
    title: "Atharva Gupta — Software Engineer",
    description: "Backend systems, distributed architecture and AI infrastructure.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Atharva Gupta — Software Engineer" },
};

export const viewport: Viewport = { themeColor: "#060709" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
