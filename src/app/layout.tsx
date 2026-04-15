import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Libre_Baskerville, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "La Folie | By Invitation Only",
  description:
    "An exclusive, referral-only nightlife collective. Born from obsession. Entry by invitation only.",
  keywords: ["nightlife", "exclusive", "membership", "events", "DJ", "underground", "collective"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${libreBaskerville.variable} ${greatVibes.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
