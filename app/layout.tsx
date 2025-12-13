import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "META Datenschutzklage | Ihre Rechte durchsetzen",
  description: "Kostenlose Vertretung bei Datenschutzklagen gegen META (Facebook, Instagram). Holen Sie sich bis zu 1.000€ Schadensersatz.",
  keywords: ["META", "Datenschutz", "Klage", "DSGVO", "Facebook", "Instagram", "Schadensersatz", "Anwalt"],
  authors: [{ name: "META Datenschutzklage" }],
  openGraph: {
    title: "META Datenschutzklage | Ihre Rechte durchsetzen",
    description: "Kostenlose Vertretung bei Datenschutzklagen gegen META. Holen Sie sich bis zu 1.000€ Schadensersatz.",
    url: "https://meta-datenschutzklage.de",
    siteName: "META Datenschutzklage",
    locale: "de_DE",
    type: "website",
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
      </body>
    </html>
  );
}
