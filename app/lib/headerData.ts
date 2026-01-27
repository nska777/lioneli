// app/lib/headerData.ts

export type MegaItem = { labelKey: string; fallback: string; href: string };

export type MegaKey =
  | "bedrooms"
  | "living"
  | "hallway"
  | "office"
  | "wardrobes"
  | "tables";

export type MegaCategory = {
  key: MegaKey;
  labelKey: string;
  fallback: string;
  href: string;
  items: MegaItem[];
};

export type TopLink = { labelKey: string; fallback: string; href: string };

export const topLinks: readonly TopLink[] = [
  { labelKey: "header.top.catalog", fallback: "Каталог", href: "/catalog" },
  { labelKey: "header.top.about", fallback: "О компании", href: "/about" },
  { labelKey: "header.top.news", fallback: "Новости", href: "/news" },
  { labelKey: "header.top.contacts", fallback: "Контакты", href: "/contacts" },
  {
    labelKey: "header.top.cooperation",
    fallback: "Сотрудничество",
    href: "/cooperation",
  },
  { labelKey: "header.top.sale", fallback: "Акции", href: "/sale" },
] as const;

/**
 * ✅ единый формат href:
 * /catalog/collection-${brand}-${category}
 *
 * ✅ единый формат id витрины:
 * col-${brand}-${category}
 */
export const makeCollectionHref = (brand: string, category: string) =>
  `/catalog/collection-${brand}-${category}`;

export const makeCollectionId = (brand: string, category: string) =>
  `col-${brand}-${category}`;

// ожидаем slug: collection-amber-bedrooms
export function parseCollectionSlug(slug: string) {
  const m = slug?.match(/^collection-([a-z0-9-]+)-([a-z0-9-]+)$/i);
  if (!m) return null;
  return { brand: m[1], category: m[2] };
}

// ✅ быстро получить brand/category из href коллекции
export function parseCollectionHref(href: string) {
  // "/catalog/collection-amber-bedrooms"
  const m = href?.match(/^\/catalog\/collection-([a-z0-9-]+)-([a-z0-9-]+)$/i);
  if (!m) return null;
  return { brand: m[1], category: m[2] };
}

export const megaCategories: MegaCategory[] = [
  {
    key: "bedrooms",
    labelKey: "header.mega.bedrooms",
    fallback: "СПАЛЬНИ",
    href: "/category/bedrooms",
    items: [
      { labelKey: "brand.amber", fallback: "АМБЕР", href: makeCollectionHref("amber", "bedrooms") },
      { labelKey: "brand.scandi", fallback: "СКАНДИ", href: makeCollectionHref("scandi", "bedrooms") },
      { labelKey: "brand.elizabeth", fallback: "ЭЛИЗАБЕТ", href: makeCollectionHref("elizabeth", "bedrooms") },
      { labelKey: "brand.salvador", fallback: "САЛЬВАДОР", href: makeCollectionHref("salvador", "bedrooms") },
      { labelKey: "brand.pitti", fallback: "ПИТТИ", href: makeCollectionHref("pitti", "bedrooms") },
      { labelKey: "brand.buongiorno", fallback: "БОНЖОРНО", href: makeCollectionHref("buongiorno", "bedrooms") },
    ],
  },
  {
    key: "living",
    labelKey: "header.mega.living",
    fallback: "ГОСТИНЫЕ",
    href: "/category/living",
    items: [
      { labelKey: "brand.scandi", fallback: "СКАНДИ", href: makeCollectionHref("scandi", "living") },
      { labelKey: "brand.pitti_alt", fallback: "ПАТТИ", href: makeCollectionHref("pitti", "living") },
      { labelKey: "brand.salvador", fallback: "САЛЬВАДОР", href: makeCollectionHref("salvador", "living") },
      { labelKey: "brand.bergen_white", fallback: "BERGEN WHITE", href: makeCollectionHref("buongiorno", "living") },
    ],
  },
  {
    key: "hallway",
    labelKey: "header.mega.hallway",
    fallback: "ПРИХОЖИЕ",
    href: "/category/hallway",
    items: [
      { labelKey: "common.inDev", fallback: "В РАЗРАБОТКЕ", href: "/category/hallway" },
    ],
  },
  {
    key: "tables",
    labelKey: "header.mega.tables",
    fallback: "СТОЛЫ И СТУЛЬЯ",
    href: "/category/tables",
    items: [
      { labelKey: "common.inDev", fallback: "В РАЗРАБОТКЕ", href: "/category/tables" },
    ],
  },
  {
    key: "wardrobes",
    labelKey: "header.mega.youth",
    fallback: "МОЛОДЕЖНЫЕ",
    href: "/category/youth",
    items: [
      { labelKey: "brand.scandi", fallback: "СКАНДИ", href: makeCollectionHref("scandi", "youth") },
      { labelKey: "brand.elizabeth", fallback: "ЭЛИЗАБЕТ", href: makeCollectionHref("elizabeth", "youth") },
    ],
  },
];


/* =========================
   MEGA MENU PREVIEWS (1 big + 2 small)
   Картинки лежат в /public/mega/...
========================= */

export type MegaPreview = {
  titleKey: string;
  fallback: string;
  main: string;
  a: string;
  b: string;
};

export const MEGA_PREVIEWS: Record<string, MegaPreview> = {
  // СПАЛЬНИ
  [makeCollectionHref("amber", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.amber",
    fallback: "Спальня «АМБЕР»",
    main: "/mega/bedrooms/amber/main.jpg",
    a: "/mega/bedrooms/amber/1.jpg",
    b: "/mega/bedrooms/amber/2.jpg",
  },
  [makeCollectionHref("scandi", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.scandi",
    fallback: "Спальня «СКАНДИ»",
    main: "/mega/bedrooms/scandi/main.jpg",
    a: "/mega/bedrooms/scandi/1.jpg",
    b: "/mega/bedrooms/scandi/2.jpg",
  },
  [makeCollectionHref("elizabeth", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.elizabeth",
    fallback: "Спальня «ЭЛИЗАБЕТ»",
    main: "/mega/bedrooms/elizabeth/main.jpg",
    a: "/mega/bedrooms/elizabeth/1.jpg",
    b: "/mega/bedrooms/elizabeth/2.jpg",
  },
  [makeCollectionHref("salvador", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.salvador",
    fallback: "Спальня «САЛЬВАДОР»",
    main: "/mega/bedrooms/salvador/main.jpg",
    a: "/mega/bedrooms/salvador/1.jpg",
    b: "/mega/bedrooms/salvador/2.jpg",
  },
  [makeCollectionHref("pitti", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.pitti",
    fallback: "Спальня «ПИТТИ»",
    main: "/mega/bedrooms/pitti/main.jpg",
    a: "/mega/bedrooms/pitti/1.jpg",
    b: "/mega/bedrooms/pitti/2.jpg",
  },
  [makeCollectionHref("buongiorno", "bedrooms")]: {
    titleKey: "mega.preview.bedrooms.buongiorno",
    fallback: "Спальня «БОНЖОРНО»",
    main: "/mega/bedrooms/buongiorno/main.jpg",
    a: "/mega/bedrooms/buongiorno/1.jpg",
    b: "/mega/bedrooms/buongiorno/2.jpg",
  },

  // ГОСТИНЫЕ
  [makeCollectionHref("scandi", "living")]: {
    titleKey: "mega.preview.living.scandi",
    fallback: "Гостиная «СКАНДИ»",
    main: "/mega/living/scandi/main.jpg",
    a: "/mega/living/scandi/1.jpg",
    b: "/mega/living/scandi/2.jpg",
  },
  [makeCollectionHref("pitti", "living")]: {
    titleKey: "mega.preview.living.pitti",
    fallback: "Гостиная «ПАТТИ»",
    main: "/mega/living/pitti/main.jpg",
    a: "/mega/living/pitti/1.jpg",
    b: "/mega/living/pitti/2.jpg",
  },
  [makeCollectionHref("salvador", "living")]: {
    titleKey: "mega.preview.living.salvador",
    fallback: "Гостиная «САЛЬВАДОР»",
    main: "/mega/living/salvador/main.jpg",
    a: "/mega/living/salvador/1.jpg",
    b: "/mega/living/salvador/2.jpg",
  },
  [makeCollectionHref("buongiorno", "living")]: {
    titleKey: "mega.preview.living.bergenWhite",
    fallback: "Гостиная «BERGEN WHITE»",
    main: "/mega/living/buongiorno/main.jpg",
    a: "/mega/living/buongiorno/1.jpg",
    b: "/mega/living/buongiorno/2.jpg",
  },

  // МОЛОДЕЖНЫЕ
  [makeCollectionHref("scandi", "youth")]: {
    titleKey: "mega.preview.youth.scandi",
    fallback: "Молодежная «СКАНДИ»",
    main: "/mega/youth/scandi/main.jpg",
    a: "/mega/youth/scandi/1.jpg",
    b: "/mega/youth/scandi/2.jpg",
  },
  [makeCollectionHref("elizabeth", "youth")]: {
    titleKey: "mega.preview.youth.elizabeth",
    fallback: "Молодежная «ЭЛИЗАБЕТ»",
    main: "/mega/youth/elizabeth/main.jpg",
    a: "/mega/youth/elizabeth/1.jpg",
    b: "/mega/youth/elizabeth/2.jpg",
  },
};

/**
 * ✅ Маппинг: href коллекции -> id "товара-витрины"
 */
export const COLLECTION_ID_BY_HREF: Record<string, string> = Object.keys(
  MEGA_PREVIEWS,
).reduce((acc, href) => {
  const meta = parseCollectionHref(href);
  if (!meta) return acc;
  acc[href] = makeCollectionId(meta.brand, meta.category);
  return acc;
}, {} as Record<string, string>);

/**
 * ✅ href -> {brand, category}
 */
export const COLLECTION_META_BY_HREF: Record<
  string,
  { brand: string; category: string }
> = Object.keys(MEGA_PREVIEWS).reduce((acc, href) => {
  const meta = parseCollectionHref(href);
  if (!meta) return acc;
  acc[href] = meta;
  return acc;
}, {} as Record<string, { brand: string; category: string }>);

export const REGION_DATA = {
  uz: {
    labelKey: "region.uz",
    fallback: "Узбекистан",
    phone: "+998 90 000-00-00",
    addresses: ["Rich House Мирзо-Улугбека, 18"],
    phonePrefix: "+998",
  },
  ru: {
    labelKey: "region.ru",
    fallback: "Россия",
    phone: "+7 495 077-85-59",
    addresses: [
      "Москва, ул. Тверская, 12",
      "Москва, Ленинградский просп., 45",
      "Санкт-Петербург, Невский пр., 28",
    ],
    phonePrefix: "+7",
  },
} as const;
