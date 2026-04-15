import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Folie | Exclusive Nightlife",
  description:
    "An exclusive, referral-only nightlife experience. By invitation only.",
  keywords: ["nightlife", "exclusive", "membership", "events", "DJ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
