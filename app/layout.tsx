import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";





export const metadata: Metadata = {
  metadataBase: new URL('https://fatosyilmazcasting.com'),
  title: "Fatoş Yılmaz Management & Casting | Cast Direktörü",
  description: "Fatoş Yılmaz yönetiminde profesyonel cast direktörlüğü ve menajerlik.",
  // Google doğrulaması buraya geliyor:
  verification: {
    google: "BRajwJY_IgCASV694ckVHfXMpksqz1xb8b5Yb8VOtkU",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Fatoş Yılmaz Management & Casting",
    description: "Profesyonel Yetenek Yönetimi ve Cast Direktörlüğü",
    url: "https://fatosyilmazcasting.com",
    siteName: "Fatoş Yılmaz Casting",
    images: [
      {
        url: "/fatos-yilmaz-og.png", // Başına https eklemene gerek kalmaz, metadataBase halleder
        width: 1200,
        height: 630,
        alt: "Fatoş Yılmaz Management & Casting Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fatoş Yılmaz Management & Casting",
    description: "Profesyonel Yetenek Yönetimi ve Cast Direktörlüğü",
    images: ["/fatos-yilmaz-og.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true} // Bu satırı ekle
      >
        {children}
      </body>
    </html>
  );
}
