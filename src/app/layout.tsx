import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans_Javanese } from "next/font/google";
import Navbar from "@/components/Navbar";
import LenisProvider from "@/components/LenisProvider";
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

export const metadata: Metadata = {
  title: "Jangkep - Jangkep Rasane, Jangkep Critane",
  description: "Website eksplorasi kuliner Jawa Tengah yang immersive dan interaktif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${dmSans.variable} ${notoJavanese.variable}`}>
      <body>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
