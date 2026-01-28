import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";



export const metadata: Metadata = {
  title: "Fatoş Yılmaz Management & Casting",
  description: "Cast Direktörü ve Menajerlik Hizmetleri. Sinema, dizi ve reklam projeleri için profesyonel yetenek yönetimi.",
  icons: {
    icon: "/favicon.svg", // SVG ikonumuzu buraya bağlıyoruz
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
