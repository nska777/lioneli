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
};

// Верхний фильтр (бренды/категории бренда)
export const BRANDS = [
  { title: "АМБЕР", slug: "amber" },
  { title: "СКАНДИ", slug: "scandi" },
  { title: "ЭЛИЗАБЕТ", slug: "elizabeth" },
  { title: "САЛЬВАДОР", slug: "salvador" },
  { title: "ПИТТИ", slug: "pitti" },
  { title: "БОНЖОРНО", slug: "bonjorno" },
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
    };
  },
);

export const CATALOG_BY_ID = new Map(CATALOG_MOCK.map((p) => [p.id, p]));
