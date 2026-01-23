// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { RegionLangProvider } from "./context/region-lang";
import { ShopStateProvider } from "./context/shop-state";
import BackToTop from "./components/ui/BackToTop";

// ✅ вынесли сюда
import Header from "./components/Header";
import Footer from "./components/sections/Footer";

// import SmoothWheelScroll from "./components/providers/SmoothWheelScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lioneto",
  description: "Lioneto furniture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {/* Плавность колёсика/тачпада по всему сайту */}
        {/* <SmoothWheelScroll duration={140} wheelMultiplier={1} maxStep={220} /> */}

        <RegionLangProvider>
          <ShopStateProvider>
            {/* ✅ шапка всегда */}
            <Header />

            {/* ✅ меняется только контент страницы */}
            {children}

            {/* ✅ футер всегда */}
            <Footer />
          </ShopStateProvider>
        </RegionLangProvider>

        {/* Глобальная кнопка */}
        <BackToTop />
      </body>
    </html>
  );
}
