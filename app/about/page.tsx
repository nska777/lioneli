// app/about/page.tsx
import type { Metadata } from "next";
import AboutClient from "./ui/AboutClient";

export const metadata: Metadata = {
  title: "О компании — Lioneto",
  description:
    "Lioneto — премиальный мебельный бренд. Узнайте о нашем подходе, ценностях и стандартах качества.",
  openGraph: {
    title: "О компании — Lioneto",
    description:
      "Lioneto — премиальный мебельный бренд. Подход, ценности и стандарты качества.",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <AboutClient />;
}
