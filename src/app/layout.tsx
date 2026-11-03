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
  metadataBase: new URL("https://jangkep.my.id"),
  title: {
    default: "Jangkep. - Jangkep Rasane, Jangkep Critane",
    template: "%s | Jangkep.",
  },
  description:
    "Dokumentasi dan penelusuran khazanah kuliner Jawa Tengah. Mengulik filosofi bumbu, riwayat racikan dapur leluhur, serta peta sebaran rasa dari pesisir hingga pedalaman tanah Jawa.",
  keywords: [
    "kuliner Jawa Tengah",
    "filosofi rasa Jawa",
    "warisan kuliner nusantara",
    "resep tradisional Jawa",
    "sejarah masakan Jawa Tengah",
    "peta kuliner Jawa",
    "Lumpia Semarang",
    "Nasi Liwet Solo",
    "Mie Ongklok Wonosobo",
    "Soto Kudus",
    "Nasi Gandul Pati",
    "Nasi Grombyang Pemalang",
    "Jangkep",
  ],
  authors: [{ name: "Jangkep" }],
  creator: "Jangkep",
  publisher: "Jangkep",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Jangkep. - Jangkep Rasane, Jangkep Critane",
    description:
      "Dokumentasi dan penelusuran khazanah kuliner Jawa Tengah. Mengulik filosofi bumbu, riwayat racikan dapur leluhur, serta peta sebaran rasa dari pesisir hingga pedalaman tanah Jawa.",
    url: "https://jangkep.my.id",
    siteName: "Jangkep",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jangkep. - Jangkep Rasane, Jangkep Critane",
    description:
      "Dokumentasi dan penelusuran khazanah kuliner Jawa Tengah. Mengulik filosofi bumbu, riwayat racikan dapur leluhur, serta peta sebaran rasa dari pesisir hingga pedalaman tanah Jawa.",
  },
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
