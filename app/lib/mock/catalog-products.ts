// app/lib/mock/catalog-products.ts
// ✅ Единый источник правды для каталога (моки)
// ✅ Экспортируем BRANDS / CATS / CATALOG_MOCK / CATALOG_BY_ID

export type BrandItem = { title: string; slug: string };
export type CatItem = { title: string; slug: string };

export type CatalogProduct = {
  id: string;
  title: string;

  // фильтры
  brand: string; // slug из BRANDS
  cat: string; // slug из CATS

  // UI
  badge?: string;
  sku?: string;
  href?: string;

  // картинки
  image: string;
  gallery?: string[];

  // цены (основные поля)
  priceRUB: number;
  priceUZS: number;

  // ✅ алиасы для совместимости со старым кодом (НЕ обязаны использоваться, но спасают проект)
  price_rub?: number;
  price_uzs?: number;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function makeGallery(basePath: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${basePath}/${pad2(i + 1)}.jpg`);
}

function makeProduct(
  p: Omit<CatalogProduct, "image"> & { basePath: string; coverIndex?: number },
) {
  const cover = pad2(p.coverIndex ?? 1);

  const priceRUB = Number(p.priceRUB ?? 0) || 0;
  const priceUZS = Number(p.priceUZS ?? 0) || 0;

  const product: CatalogProduct = {
    id: p.id,
    title: p.title,
    brand: p.brand,
    cat: p.cat,
    badge: p.badge ?? "",
    sku: p.sku ?? "",
    href: p.href ?? `/product/${p.id}`,
    image: `${p.basePath}/${cover}.jpg`,
    gallery: p.gallery ?? [],
    priceRUB,
    priceUZS,

    // ✅ совместимость (старые компоненты ждут snake_case)
    price_rub: priceRUB,
    price_uzs: priceUZS,
  };

  return product;
}

// ✅ коллекции (бренды/серии)
export const BRANDS: BrandItem[] = [
  { title: "AMBER", slug: "amber" },
  { title: "BUONGIORNO", slug: "buongiorno" },
  { title: "ELIZABETH", slug: "elizabeth" },
  { title: "PITTI", slug: "pitti" },
  { title: "SALVADOR", slug: "salvador" },
  { title: "SCANDI", slug: "scandi" },

  // 🔻 Тут добавишь следующие 5 коллекций (по аналогии)
  // { title: "NEWCOLL", slug: "newcoll" },
];

export const CATS: CatItem[] = [
  { title: "Фасады", slug: "fasadi" },
  { title: "Комоды", slug: "komody" },
  { title: "Кровати", slug: "krovati" },
  { title: "Полки", slug: "polki" },
  { title: "Шкафы", slug: "shkafy" },
  { title: "Стеллажи", slug: "stellaji" },
  { title: "Столы", slug: "stoli" },
  { title: "Тумбы", slug: "tumby" },
  { title: "Вешалки", slug: "veshalki" },
  { title: "Витрины", slug: "vitrini" },
  { title: "Зеркала", slug: "zerkala" },
];

// ------------------------------------------------------
// ✅ Текущая коллекция SCANDI
// public/products/scandi/...
// ------------------------------------------------------

export const CATALOG_MOCK: CatalogProduct[] = [
  makeProduct({
    id: "scandi-fasadi-set",
    title: "SCANDI · Фасады",
    brand: "scandi",
    cat: "fasadi",
    basePath: "/products/scandi/fasadi",
    gallery: makeGallery("/products/scandi/fasadi", 5),
    priceRUB: 89000,
    priceUZS: 12900000,
  }),

  makeProduct({
    id: "scandi-komody-komod-shirokiy",
    title: "Комод широкий",
    brand: "scandi",
    cat: "komody",
    basePath: "/products/scandi/komody/komod-shirokiy",
    gallery: makeGallery("/products/scandi/komody/komod-shirokiy", 2),
    priceRUB: 69900,
    priceUZS: 9800000,
  }),
  makeProduct({
    id: "scandi-komody-komod-standart",
    title: "Комод стандарт",
    brand: "scandi",
    cat: "komody",
    basePath: "/products/scandi/komody/komod-standart",
    gallery: makeGallery("/products/scandi/komody/komod-standart", 2),
    priceRUB: 59900,
    priceUZS: 8500000,
  }),

  makeProduct({
    id: "scandi-krovati-krovati-max",
    title: "Кровать MAX",
    brand: "scandi",
    cat: "krovati",
    basePath: "/products/scandi/krovati/krovati-max",
    gallery: makeGallery("/products/scandi/krovati/krovati-max", 9),
    priceRUB: 149900,
    priceUZS: 21500000,
  }),
  makeProduct({
    id: "scandi-krovati-krovati-min",
    title: "Кровать MIN",
    brand: "scandi",
    cat: "krovati",
    basePath: "/products/scandi/krovati/krovati-min",
    gallery: makeGallery("/products/scandi/krovati/krovati-min", 5),
    priceRUB: 129900,
    priceUZS: 18900000,
  }),

  makeProduct({
    id: "scandi-polki-set",
    title: "Полки (набор)",
    brand: "scandi",
    cat: "polki",
    basePath: "/products/scandi/polki",
    gallery: makeGallery("/products/scandi/polki", 5),
    priceRUB: 19900,
    priceUZS: 2900000,
  }),

  makeProduct({
    id: "scandi-shkafy-shkaf-big",
    title: "Шкаф BIG",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/shkaf-big",
    gallery: makeGallery("/products/scandi/shkafy/shkaf-big", 18),
    priceRUB: 189900,
    priceUZS: 27500000,
  }),
  makeProduct({
    id: "scandi-shkafy-shkaf-bigger",
    title: "Шкаф BIGGER",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/shkaf-bigger",
    gallery: makeGallery("/products/scandi/shkafy/shkaf-bigger", 6),
    priceRUB: 209900,
    priceUZS: 30500000,
  }),
  makeProduct({
    id: "scandi-shkafy-shkaf-max",
    title: "Шкаф MAX",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/shkaf-max",
    gallery: makeGallery("/products/scandi/shkafy/shkaf-max", 14),
    priceRUB: 199900,
    priceUZS: 29500000,
  }),
  makeProduct({
    id: "scandi-shkafy-shkaf-min",
    title: "Шкаф MIN",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/shkaf-min",
    gallery: makeGallery("/products/scandi/shkafy/shkaf-min", 10),
    priceRUB: 159900,
    priceUZS: 23900000,
  }),
  makeProduct({
    id: "scandi-shkafy-shkaf-standart",
    title: "Шкаф STANDARD",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/shkaf-standart",
    gallery: makeGallery("/products/scandi/shkafy/shkaf-standart", 5),
    priceRUB: 169900,
    priceUZS: 24900000,
  }),

  makeProduct({
    id: "scandi-stellaji-stellaj-shirokiy",
    title: "Стеллаж широкий",
    brand: "scandi",
    cat: "stellaji",
    basePath: "/products/scandi/stellaji/stellaj-shirokiy",
    gallery: makeGallery("/products/scandi/stellaji/stellaj-shirokiy", 2),
    priceRUB: 49900,
    priceUZS: 7200000,
  }),
  makeProduct({
    id: "scandi-stellaji-stellaj-standart",
    title: "Стеллаж стандарт",
    brand: "scandi",
    cat: "stellaji",
    basePath: "/products/scandi/stellaji/stellaj-standart",
    gallery: makeGallery("/products/scandi/stellaji/stellaj-standart", 4),
    priceRUB: 45900,
    priceUZS: 6600000,
  }),

  makeProduct({
    id: "scandi-stoli-stoli-jurnalnie",
    title: "Стол журнальный",
    brand: "scandi",
    cat: "stoli",
    basePath: "/products/scandi/stoli/stoli-jurnalnie",
    gallery: makeGallery("/products/scandi/stoli/stoli-jurnalnie", 1),
    priceRUB: 17900,
    priceUZS: 2600000,
  }),
  makeProduct({
    id: "scandi-stoli-stoli-standart",
    title: "Стол стандарт",
    brand: "scandi",
    cat: "stoli",
    basePath: "/products/scandi/stoli/stoli-standart",
    gallery: makeGallery("/products/scandi/stoli/stoli-standart", 8),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),

  makeProduct({
    id: "scandi-tumby-tumbi-shirokie",
    title: "Тумба широкая",
    brand: "scandi",
    cat: "tumby",
    basePath: "/products/scandi/tumby/tumbi-shirokie",
    gallery: makeGallery("/products/scandi/tumby/tumbi-shirokie", 2),
    priceRUB: 44900,
    priceUZS: 6500000,
  }),
  makeProduct({
    id: "scandi-tumby-tumbi-standart",
    title: "Тумба стандарт",
    brand: "scandi",
    cat: "tumby",
    basePath: "/products/scandi/tumby/tumbi-standart",
    gallery: makeGallery("/products/scandi/tumby/tumbi-standart", 8),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "scandi-tumby-tumbi-tv",
    title: "Тумба TV",
    brand: "scandi",
    cat: "tumby",
    basePath: "/products/scandi/tumby/tumbi-tv",
    gallery: makeGallery("/products/scandi/tumby/tumbi-tv", 2),
    priceRUB: 55900,
    priceUZS: 8100000,
  }),

  makeProduct({
    id: "scandi-veshalki-set",
    title: "Вешалка",
    brand: "scandi",
    cat: "veshalki",
    basePath: "/products/scandi/veshalki",
    gallery: makeGallery("/products/scandi/veshalki", 2),
    priceRUB: 12900,
    priceUZS: 1900000,
  }),

  makeProduct({
    id: "scandi-vitrini-vitrina-max",
    title: "Витрина MAX",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/vitrina-max",
    gallery: makeGallery("/products/scandi/vitrini/vitrina-max", 10),
    priceRUB: 99900,
    priceUZS: 14500000,
  }),
  makeProduct({
    id: "scandi-vitrini-vitrina-min",
    title: "Витрина MIN",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/vitrina-min",
    gallery: makeGallery("/products/scandi/vitrini/vitrina-min", 6),
    priceRUB: 79900,
    priceUZS: 11800000,
  }),

  makeProduct({
    id: "scandi-zerkala-zerkala-dlina",
    title: "Зеркало (длина)",
    brand: "scandi",
    cat: "zerkala",
    basePath: "/products/scandi/zerkala/zerkala-dlina",
    gallery: makeGallery("/products/scandi/zerkala/zerkala-dlina", 1),
    priceRUB: 14900,
    priceUZS: 2200000,
  }),
  makeProduct({
    id: "scandi-zerkala-zerkala-shirina",
    title: "Зеркало (ширина)",
    brand: "scandi",
    cat: "zerkala",
    basePath: "/products/scandi/zerkala/zerkala-shirina",
    gallery: makeGallery("/products/scandi/zerkala/zerkala-shirina", 1),
    priceRUB: 14900,
    priceUZS: 2200000,
  }),
  makeProduct({
    id: "scandi-zerkala-zerkala-standart",
    title: "Зеркало стандарт",
    brand: "scandi",
    cat: "zerkala",
    basePath: "/products/scandi/zerkala/zerkala-standart",
    gallery: makeGallery("/products/scandi/zerkala/zerkala-standart", 1),
    priceRUB: 13900,
    priceUZS: 2050000,
  }),

  // ------------------------------------------------------
  // 🔻 ДОБАВЛЕНИЕ ЕЩЁ 5 КОЛЛЕКЦИЙ
  // 1) добавь brand в BRANDS (slug = имя папки в public/products/<slug>/...)
  // 2) ниже вставляй блоки makeProduct(...) по аналогии со SCANDI
  // ------------------------------------------------------
];

// ✅ быстрый доступ к товару по id: Map (чтобы работал .get())
export const CATALOG_BY_ID = new Map<string, CatalogProduct>(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
);

// ✅ запасной вариант: Object-словарь (если где-то было CATALOG_BY_ID[id])
export const CATALOG_BY_ID_OBJ = Object.fromEntries(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
) as Record<string, CatalogProduct>;
