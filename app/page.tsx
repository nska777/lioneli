// app/page.tsx
import GSAPHeroSlider from "./components/home/GSAPHeroSlider";
import BestSellers from "./components/home/BestSellers";
import BestPrice from "./components/home/BestPrice";
import AboutCompany from "./components/home/AboutCompany";
import CollectionsSlider from "./components/home/CollectionsSlider";

// ✅ секция поставок/новостей
import SupplyNewsSection from "./components/home/SupplyNewsSection";
import { supplyNewsMock } from "./mocks/supplyNews";
import NewsletterCta from "./components/home/NewsletterCta";

import { getGlobal } from "../app/lib/strapi";

const demoCollections = [
  {
    id: "1",
    title: "Спальня Salvador — идеальная классика",
    description:
      "Премиальная коллекция «SALVADOR», выполненная в неоклассическом стиле — это исключительное качество и элегантность, представленное в таких трендовых цветовых решениях, как: «Белый», «Пепельная Роза» и «Кашемир».\n\nПремиальная коллекция «SALVADOR», выполненная в неоклассическом стиле — это исключительное качество и элегантность, представленное в таких трендовых цветовых решениях, как: «Белый», «Пепельная Роза» и «Кашемир».",
    images: [
      { url: "/images/home/collections/1.jpg" },
      { url: "/images/home/collections/2.jpg" },
      { url: "/images/home/collections/3.jpg" },
    ],
  },
  {
    id: "2",
    title: "Amber — свет и воздух",
    description:
      "AMBER — коллекция, выполненная в стиле контемпорари — это элегантный и функциональный дизайн, сочетающий в себе современные тенденции и высокое качество материалов. AMBER — это широкий модульный ряд, благодаря которому в едином стиле можно обставить квартиру и даже целый дом!",
    images: [
      { url: "/images/home/collections/4.jpg" },
      { url: "/images/home/collections/5.jpg" },
      { url: "/images/home/collections/6.jpg" },
    ],
  },
  {
    id: "3",
    title: "Pitti",
    description:
      "Коллекция мебели «Pitti» была названа в честь самого большого дворца во Флоренции. Использование натуральных материалов (массив ясеня), изящные линии, благородные ткани и тёмная гамма — всё это отсылает к флорентийскому стилю.",
    images: [
      { url: "/images/home/collections/7.jpg" },
      { url: "/images/home/collections/8.jpg" },
      { url: "/images/home/collections/9.jpg" },
    ],
  },
  {
    id: "4",
    title: "SCANDY",
    description:
      "В коллекции SCANDY, выполненной в скандинавском стиле, всё лаконично и натурально. Добротность, функциональность и комфорт — всё то, что так ценят современные покупатели.",
    images: [
      { url: "/images/home/collections/10.jpg" },
      { url: "/images/home/collections/11.jpg" },
      { url: "/images/home/collections/12.jpg" },
    ],
  },
];

export default async function Page() {
  const global = await getGlobal();

  // ✅ Быстрая проверка, что данные реально приходят
  console.log("GLOBAL FROM STRAPI (home page):", global);

  return (
    <main>
      <GSAPHeroSlider />

      <BestSellers />
      <BestPrice />
      <AboutCompany />

      <CollectionsSlider
        collections={demoCollections}
        autoplayMs={7500}
        imageAutoplayMs={2600}
      />

      <SupplyNewsSection items={supplyNewsMock} />
      <NewsletterCta backgroundUrl="/images/home/newsletter-bg.jpg" />

      {/* <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
          Strapi debug (temporary)
        </div>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.85 }}>
          {JSON.stringify(global, null, 2)}
        </pre>
      </div>✅ временный вывод для проверки, потом уберём */}
    </main>
  );
}
