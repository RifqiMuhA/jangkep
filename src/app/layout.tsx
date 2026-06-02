import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Javanese, Pinyon_Script } from "next/font/google";
import Navbar from "@/components/Navbar";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const notoJavanese = Noto_Sans_Javanese({
  variable: "--font-noto-javanese",
  subsets: ["javanese", "latin"],
  weight: ["400"],
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Jangkep — Jangkep Rasane, Jangkep Critane",
  description:
    "Website eksplorasi kuliner Jawa Tengah yang immersive dan interaktif. Jelajahi peta rasa, resep tradisional, dan cerita di balik makanan khas Jawa Tengah.",
  keywords: [
    "kuliner Jawa Tengah",
    "makanan tradisional",
    "resep Jawa",
    "Gudeg",
    "Lumpia Semarang",
    "Nasi Liwet Solo",
    "peta kuliner",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${dmSans.variable} ${notoJavanese.variable} ${pinyonScript.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
