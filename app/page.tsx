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

// ✅ НОВЫЕ моки только для CollectionsSlider
import { COLLECTIONS_SLIDER_MOCK } from "./lib/mock/collections-slider"; // ⚠️ если путь другой — поправь

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

      <CollectionsSlider collections={COLLECTIONS_SLIDER_MOCK} />

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
