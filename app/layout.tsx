import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";





export const metadata: Metadata = {
  title: "Fatoş Yılmaz Management & Casting | Cast Direktörü",
  description: "Fatoş Yılmaz yönetiminde profesyonel cast direktörlüğü ve menajerlik.",
  // Google doğrulaması buraya geliyor:
  verification: {
    google: "BRajwJY_IgCASV694ckVHfXMpksqz1xb8b5Yb8VOtkU",
  },
  icons: {
    icon: "/favicon.svg",
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
