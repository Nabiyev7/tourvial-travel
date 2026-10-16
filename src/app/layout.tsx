import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Karvon — Premium sayohat agentligi",
  description:
    "Rim, Dubay, Istanbul, Parij, Tokio va Nyu-Yorkka shaxsiy menejer bilan tayyorlangan premium sayohatlar.",
  openGraph: {
    title: "Karvon — Premium sayohat agentligi",
    description:
      "Rim, Dubay, Istanbul, Parij, Tokio va Nyu-Yorkka shaxsiy menejer bilan tayyorlangan premium sayohatlar.",
    locale: "uz_UZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
