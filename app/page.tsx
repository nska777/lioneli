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
    title: "​Amber — свет и воздух",
    description:
      "AMBER — коллекция, выполненная в стилеконтемпорари — это элегантный ифункциональный дизайн, сочетающий в себесовременные тенденции и высокое качествоматериаловAMBER — это коллекция, в которой каждая детальтщательно продумана, чтобы обеспечитьоптимальный комфорт и удобство использования.AMBER — это широкий модульный ряд, благодарякоторому в едином стиле можно обставитьквартиру и даже целый дом!Цветовая палитра коллекции включает в себянейтральные оттенки, которые позволяют легкосочетать мебель с самыми разными стилями винтерьере, а комбинирование различныхматериалов и текстур придает ей особый шармСтильные деревянные акценты создают контраст иделают мебель по-настоящему уникальной!",
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
      "Коллекция мебели «Pitti» была названа в честь самогобольшого дворца (палаццо) во Флоренции. Сам дворецявляется выдающимся памятником архитектуры XV века(период Раннего Возрождения). Строительство этогострогого здания было начато в 1458 году флорентийскимбанкиром Лукой Питти, главным сторонником и близкимдругом Козимо Медичи. Что же в коллекции «Pitti» говорит о легендарномфлорентийском стиле? - использование натуральных материалов (массив ясеня); - изящные и плавные линии (высокие и точенныеножкитуалетного столика) - характерные декоративные элементы (опоры,выполненные в форме «луковиц»); - низкие кровати со сложной конструкцией изголовья; - использование в обивки мебели (изголовье кровати)дорогих тканей благородного оттенка; - темная цветовая гамма.Но и это еще не все… ",
    images: [
      { url: "/images/home/collections/7.jpg" },
      { url: "/images/home/collections/8.jpg" },
      { url: "/images/home/collections/9.jpg" },
    ],
  },
  {
    id: "4",
    title: "​SCANDY",
    description:
      "В коллекции SCANDY, выполненной вскандинавском стиле, все лаконично исдержанно, все гармонично и натурально. А ещеSCANDY — это добротность, функциональностьи комфорт — все то, что так ценят современныепокупатели. — В дизайне данной коллекции творческипереработаны правила популярной жизненнойфилософии LAGOM — и все с учетом запросовроссийских потребителей. — Коллекция включает в себя 54 изделия дляоформления: спальни, молодежной комнаты,гардеробной, гостиной, рабочего кабинета,библиотеки и прихожей.",
    images: [
      { url: "/images/home/collections/10.jpg" },
      { url: "/images/home/collections/11.jpg" },
      { url: "/images/home/collections/12.jpg" },
    ],
  },
];

export default function Home() {
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
    </main>
  );
}
