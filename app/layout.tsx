import type { Metadata } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
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
  title: "Fatoş Yılmaz Casting | Cast Director",
  description: "20+ years of experience in professional cast directing for film and TV. Istanbul, Zurich, Berlin, Amsterdam.",
  alternates: {
    canonical: '/',
  },
  verification: {
    google: "BRajwJY_IgCASV694ckVHfXMpksqz1xb8b5Yb8VOtkU",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Fatoş Yılmaz Casting",
    description: "Professional Cast Directing & Talent Management",
    url: "https://fatosyilmazcasting.com",
    siteName: "Fatoş Yılmaz Casting",
    images: [
      {
        url: "/fatos-yilmaz-og.png",
        width: 1200,
        height: 630,
        alt: "Fatoş Yılmaz Management - Cast Director",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fatoş Yılmaz Casting",
    description: "Professional Cast Directing & Talent Management",
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
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
