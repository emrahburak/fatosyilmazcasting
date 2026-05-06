import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fatosyilmazcasting.com'),
  title: "Fatoş Yılmaz Casting | Cast Direktörü",
  description: "20+ yıllık deneyimle sinema ve dizi projeleri için profesyonel cast direktörlüğü. İstanbul, Zurich, Berlin, Amsterdam.",
  verification: {
    google: "BRajwJY_IgCASV694ckVHfXMpksqz1xb8b5Yb8VOtkU",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Fatoş Yılmaz Casting",
    description: "Profesyonel Cast Direktörlüğü ve Yetenek Yönetimi",
    url: "https://fatosyilmazcasting.com",
    siteName: "Fatoş Yılmaz Casting",
    images: [
      {
        url: "/fatos-yilmaz-og.png",
        width: 1200,
        height: 630,
        alt: "Fatoş Yılmaz Casting",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fatoş Yılmaz Casting",
    description: "Profesyonel Cast Direktörlüğü ve Yetenek Yönetimi",
    images: ["/fatos-yilmaz-og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${cinzel.variable} ${crimsonPro.variable} antialiased`}
        style={{ fontFamily: 'var(--font-crimson), serif' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
