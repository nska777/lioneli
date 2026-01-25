// lib/mock/catalog-products.ts

export type CatalogProduct = {
  id: string;
  title: string;

  price_rub: number;
  price_uzs: number;

  badge?: string;
  image: string;

  brand: string;
  category: string;

  menu: string;
  collection: string;
  type: string;

  // ✅ опционально (чтобы не ломать текущие моки)
  isCollection?: false;
};

export type CollectionShowcaseProduct = {
  id: string; // col-amber-bedrooms
  title: string;

  price_rub: number;
  price_uzs: number;

  badge?: string;
  image: string;

  isCollection: true;

  brand: string;
  category: string;

  // ✅ чтобы CartClient не ломался, если где-то ожидают эти поля
  // (мы не обязаны, но это "страховка")
  menu?: string;
  collection?: string;
  type?: string;
};

export type AnyProduct = CatalogProduct | CollectionShowcaseProduct;

// Верхний фильтр (бренды/категории бренда)
export const BRANDS = [
  { title: "АМБЕР", slug: "amber" },
  { title: "СКАНДИ", slug: "scandi" },
  { title: "ЭЛИЗАБЕТ", slug: "elizabeth" },
  { title: "САЛЬВАДОР", slug: "salvador" },
  { title: "ПИТТИ", slug: "pitti" },
  // ✅ привели к одному slug (важно для фильтрации коллекций)
  { title: "БОНЖОРНО", slug: "buongiorno" },
] as const;

export const CATS = [
  { title: "Спальни", slug: "bedrooms" },
  { title: "Гостиные", slug: "living" },
  { title: "Молодежные", slug: "youth" },
  { title: "Прихожие", slug: "hallway" },
  { title: "Столы и стулья", slug: "tables" },
] as const;

// Левый сайдбар
export const MENU_ITEMS = [
  { label: "Столы и стулья", value: "menu_tables" },
  { label: "Шкафы купе", value: "menu_wardrobe" },
  { label: "Кабинеты", value: "menu_office" },
  { label: "Прихожие", value: "menu_hallway" },
  { label: "Гостиные", value: "menu_living" },
  { label: "Спальни", value: "menu_bedrooms" },
];

export const COLLECTION_ITEMS = [
  { label: "Bergen Dark", value: "bergen_dark" },
  { label: "Bergen Dub", value: "bergen_dub" },
  { label: "Bergen Latte", value: "bergen_latte" },
  { label: "Bergen White", value: "bergen_white" },
  { label: "Bryce", value: "bryce" },
  { label: "Florence Bianco", value: "florence_bianco" },
  { label: "Florence Ciliegio", value: "florence_ciliegio" },
  { label: "Makassar Dub", value: "makassar_dub" },
  { label: "Modena", value: "modena" },
];

export const TYPE_ITEMS = [
  { label: "Комоды", value: "komody" },
  { label: "Консоли", value: "konsoli" },
  { label: "Столы обеденные", value: "stoly_obed" },
  { label: "Столы письменные", value: "stoly_pism" },
  { label: "Стулья и кресла", value: "stulya_kresla" },
  { label: "Тумбы ТВ", value: "tumby_tv" },
  { label: "Шкафы", value: "shkafy" },
  { label: "Витрины", value: "vitriny" },
  { label: "Библиотеки и стеллажи", value: "stellazhi" },
  { label: "Полукресла", value: "polukresla" },
];

// ✅ локальные демо-фото (лежат в public/demo/products)
const DEMO_IMAGES = [
  "/demo/products/p1.jpg",
  "/demo/products/p2.jpg",
  "/demo/products/p3.jpg",
  "/demo/products/p4.jpg",
  "/demo/products/p5.jpg",
  "/demo/products/p6.jpg",
  "/demo/products/p7.jpg",
  "/demo/products/p8.jpg",
  "/demo/products/p9.jpg",
  "/demo/products/p10.jpg",
  "/demo/products/p11.jpg",
  "/demo/products/p12.jpg",
];

// ✅ мок — сразу с полями под будущий Strapi
export const CATALOG_MOCK: CatalogProduct[] = Array.from({ length: 24 }).map(
  (_, i) => {
    const brand = BRANDS[i % BRANDS.length].slug;
    const category = CATS[i % CATS.length].slug;

    const menu = MENU_ITEMS[i % MENU_ITEMS.length].value;
    const collection = COLLECTION_ITEMS[i % COLLECTION_ITEMS.length].value;
    const type = TYPE_ITEMS[i % TYPE_ITEMS.length].value;

    const baseRub = 41800 + i * 3500;

    return {
      id: String(i + 1),
      title:
        category === "bedrooms"
          ? `Тумба прикроватная ${i + 1}`
          : category === "living"
            ? `Витрина ${i + 1}`
            : category === "youth"
              ? `Шкаф молодежный ${i + 1}`
              : category === "hallway"
                ? `Прихожая модуль ${i + 1}`
                : `Стол ${i + 1}`,

      price_rub: baseRub,
      price_uzs: Math.round(baseRub * 140),

      badge: i % 6 === 0 ? "Хит продаж" : i % 9 === 0 ? "Новинка" : "",
      image: DEMO_IMAGES[i % DEMO_IMAGES.length],

      brand,
      category,

      menu,
      collection,
      type,

      isCollection: false,
    };
  },
);

// =====================================================
// ✅ ВИТРИНЫ-КОЛЛЕКЦИИ (покупаются как 1 товар)
// =====================================================

export const COLLECTION_PRODUCTS: CollectionShowcaseProduct[] = [
  // bedrooms
  {
    id: "col-amber-bedrooms",
    title: "Спальня «АМБЕР»",
    price_rub: 48900,
    price_uzs: 6852000,
    badge: "Коллекция",
    image: "/mega/bedrooms/amber/main.jpg",
    isCollection: true,
    brand: "amber",
    category: "bedrooms",
  },
  {
    id: "col-scandi-bedrooms",
    title: "Спальня «СКАНДИ»",
    price_rub: 47900,
    price_uzs: 6710000,
    badge: "Коллекция",
    image: "/mega/bedrooms/scandi/main.jpg",
    isCollection: true,
    brand: "scandi",
    category: "bedrooms",
  },
  {
    id: "col-elizabeth-bedrooms",
    title: "Спальня «ЭЛИЗАБЕТ»",
    price_rub: 51200,
    price_uzs: 7168000,
    badge: "Коллекция",
    image: "/mega/bedrooms/elizabeth/main.jpg",
    isCollection: true,
    brand: "elizabeth",
    category: "bedrooms",
  },
  {
    id: "col-salvador-bedrooms",
    title: "Спальня «САЛЬВАДОР»",
    price_rub: 53500,
    price_uzs: 7490000,
    badge: "Коллекция",
    image: "/mega/bedrooms/salvador/main.jpg",
    isCollection: true,
    brand: "salvador",
    category: "bedrooms",
  },
  {
    id: "col-pitti-bedrooms",
    title: "Спальня «ПИТТИ»",
    price_rub: 50500,
    price_uzs: 7070000,
    badge: "Коллекция",
    image: "/mega/bedrooms/pitti/main.jpg",
    isCollection: true,
    brand: "pitti",
    category: "bedrooms",
  },
  {
    id: "col-buongiorno-bedrooms",
    title: "Спальня «БОНЖОРНО»",
    price_rub: 49800,
    price_uzs: 6972000,
    badge: "Коллекция",
    image: "/mega/bedrooms/buongiorno/main.jpg",
    isCollection: true,
    brand: "buongiorno",
    category: "bedrooms",
  },

  // living
  {
    id: "col-scandi-living",
    title: "Гостиная «СКАНДИ»",
    price_rub: 45900,
    price_uzs: 6426000,
    badge: "Коллекция",
    image: "/mega/living/scandi/main.jpg",
    isCollection: true,
    brand: "scandi",
    category: "living",
  },
  {
    id: "col-pitti-living",
    title: "Гостиная «ПАТТИ»",
    price_rub: 47200,
    price_uzs: 6608000,
    badge: "Коллекция",
    image: "/mega/living/pitti/main.jpg",
    isCollection: true,
    brand: "pitti",
    category: "living",
  },
  {
    id: "col-salvador-living",
    title: "Гостиная «САЛЬВАДОР»",
    price_rub: 52500,
    price_uzs: 7350000,
    badge: "Коллекция",
    image: "/mega/living/salvador/main.jpg",
    isCollection: true,
    brand: "salvador",
    category: "living",
  },
  {
    id: "col-buongiorno-living",
    title: "Гостиная «BERGEN WHITE»",
    price_rub: 49900,
    price_uzs: 6986000,
    badge: "Коллекция",
    image: "/mega/living/buongiorno/main.jpg",
    isCollection: true,
    brand: "buongiorno",
    category: "living",
  },

  // youth
  {
    id: "col-scandi-youth",
    title: "Молодежная «СКАНДИ»",
    price_rub: 44100,
    price_uzs: 6174000,
    badge: "Коллекция",
    image: "/mega/youth/scandi/main.jpg",
    isCollection: true,
    brand: "scandi",
    category: "youth",
  },
  {
    id: "col-elizabeth-youth",
    title: "Молодежная «ЭЛИЗАБЕТ»",
    price_rub: 46500,
    price_uzs: 6510000,
    badge: "Коллекция",
    image: "/mega/youth/elizabeth/main.jpg",
    isCollection: true,
    brand: "elizabeth",
    category: "youth",
  },
];

// ✅ единая база: и товары, и витрины
export const CATALOG_ALL: AnyProduct[] = [...CATALOG_MOCK, ...COLLECTION_PRODUCTS];

// ✅ чтобы /cart и любая логика по id работали без правок
export const CATALOG_BY_ID = new Map<string, AnyProduct>(
  CATALOG_ALL.map((p) => [p.id, p]),
);
