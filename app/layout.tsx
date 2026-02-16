import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Root metadata - her iki route group da bunu inherit eder
export const metadata: Metadata = {
  metadataBase: new URL('https://fatosyilmazcasting.com'),
  title: {
    default: "Fatoş Yılmaz Management & Casting",
    template: "%s | Fatoş Yılmaz Casting",
  },
  description: "Profesyonel Yetenek Yönetimi ve Cast Direktörlüğü",
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
        url: "/fatos-yilmaz-og.png",
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
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
