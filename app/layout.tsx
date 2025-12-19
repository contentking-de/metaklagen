import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import GoogleAds from "@/components/GoogleAds";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "META Datenschutzklage | Ihre Rechte durchsetzen",
  description: "Kostenlose Vertretung bei Datenschutzklagen gegen META (Facebook, Instagram). Holen Sie sich bis zu 10.000€ Schadensersatz.",
  keywords: ["META", "Datenschutz", "Klage", "DSGVO", "Facebook", "Instagram", "Schadensersatz", "Anwalt"],
  authors: [{ name: "META Datenschutzklage" }],
  openGraph: {
    title: "META Datenschutzklage | Ihre Rechte durchsetzen",
    description: "Kostenlose Vertretung bei Datenschutzklagen gegen META. Holen Sie sich bis zu 10.000€ Schadensersatz.",
    url: "https://www.meta-datenschutzklage.de",
    siteName: "META Datenschutzklage",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "https://www.meta-datenschutzklage.de/meta-datenschutzklage.jpg",
        width: 1200,
        height: 630,
        alt: "META Datenschutzklage - Bis zu 10.000€ Schadensersatz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "META Datenschutzklage | Ihre Rechte durchsetzen",
    description: "Kostenlose Vertretung bei Datenschutzklagen gegen META. Holen Sie sich bis zu 10.000€ Schadensersatz.",
    images: ["https://www.meta-datenschutzklage.de/meta-datenschutzklage.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
        <CookieConsent />
        <GoogleAds />
      </body>
    </html>
  );
}
