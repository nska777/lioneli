// app/lib/headerData.ts

export type MegaItem = { label: string; href: string };

export type MegaKey =
  | "bedrooms"
  | "living"
  | "hallway"
  | "office"
  | "wardrobes"
  | "tables";

export type MegaCategory = {
  key: MegaKey;
  label: string;
  href: string;
  items: MegaItem[];
};

export const topLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/about" },
  { label: "Новости", href: "/news" },
  { label: "Контакты", href: "/contacts" },
  { label: "Сотрудничество", href: "/cooperation" },
  { label: "Акции", href: "/sale" },
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
    label: "СПАЛЬНИ",
    href: "/category/bedrooms",
    items: [
      { label: "АМБЕР", href: makeCollectionHref("amber", "bedrooms") },
      { label: "СКАНДИ", href: makeCollectionHref("scandi", "bedrooms") },
      { label: "ЭЛИЗАБЕТ", href: makeCollectionHref("elizabeth", "bedrooms") },
      { label: "САЛЬВАДОР", href: makeCollectionHref("salvador", "bedrooms") },
      { label: "ПИТТИ", href: makeCollectionHref("pitti", "bedrooms") },
      // ✅ важно: buongiorno везде одинаково
      { label: "БОНЖОРНО", href: makeCollectionHref("buongiorno", "bedrooms") },
    ],
  },
  {
    key: "living",
    label: "ГОСТИНЫЕ",
    href: "/category/living",
    items: [
      { label: "СКАНДИ", href: makeCollectionHref("scandi", "living") },
      { label: "ПАТТИ", href: makeCollectionHref("pitti", "living") },
      { label: "САЛЬВАДОР", href: makeCollectionHref("salvador", "living") },
      { label: "BERGEN WHITE", href: makeCollectionHref("buongiorno", "living") },
    ],
  },
  {
    key: "hallway",
    label: "МОЛОДЕЖНЫЕ",
    href: "/category/youth",
    items: [
      { label: "СКАНДИ", href: makeCollectionHref("scandi", "youth") },
      { label: "ЭЛИЗАБЕТ", href: makeCollectionHref("elizabeth", "youth") },
    ],
  },
  {
    key: "office",
    label: "ПРИХОЖИЕ",
    href: "/category/office",
    items: [{ label: "В РАЗРАБОТКЕ", href: "/category/office" }],
  },
  {
    key: "wardrobes",
    label: "СТОЛЫ И СТУЛЬЯ",
    href: "/category/wardrobes",
    items: [{ label: "В РАЗРАБОТКЕ", href: "/catalog/bryce" }],
  },
];

/* =========================
   MEGA MENU PREVIEWS (1 big + 2 small)
   Картинки лежат в /public/mega/...
========================= */

export type MegaPreview = {
  title: string; // подпись на большой фотке
  main: string; // большая
  a: string; // маленькая 1
  b: string; // маленькая 2
};

export const MEGA_PREVIEWS: Record<string, MegaPreview> = {
  // СПАЛЬНИ
  [makeCollectionHref("amber", "bedrooms")]: {
    title: "Спальня «АМБЕР»",
    main: "/mega/bedrooms/amber/main.jpg",
    a: "/mega/bedrooms/amber/1.jpg",
    b: "/mega/bedrooms/amber/2.jpg",
  },
  [makeCollectionHref("scandi", "bedrooms")]: {
    title: "Спальня «СКАНДИ»",
    main: "/mega/bedrooms/scandi/main.jpg",
    a: "/mega/bedrooms/scandi/1.jpg",
    b: "/mega/bedrooms/scandi/2.jpg",
  },
  [makeCollectionHref("elizabeth", "bedrooms")]: {
    title: "Спальня «ЭЛИЗАБЕТ»",
    main: "/mega/bedrooms/elizabeth/main.jpg",
    a: "/mega/bedrooms/elizabeth/1.jpg",
    b: "/mega/bedrooms/elizabeth/2.jpg",
  },
  [makeCollectionHref("salvador", "bedrooms")]: {
    title: "Спальня «САЛЬВАДОР»",
    main: "/mega/bedrooms/salvador/main.jpg",
    a: "/mega/bedrooms/salvador/1.jpg",
    b: "/mega/bedrooms/salvador/2.jpg",
  },
  [makeCollectionHref("pitti", "bedrooms")]: {
    title: "Спальня «ПИТТИ»",
    main: "/mega/bedrooms/pitti/main.jpg",
    a: "/mega/bedrooms/pitti/1.jpg",
    b: "/mega/bedrooms/pitti/2.jpg",
  },
  [makeCollectionHref("buongiorno", "bedrooms")]: {
    title: "Спальня «БОНЖОРНО»",
    main: "/mega/bedrooms/buongiorno/main.jpg",
    a: "/mega/bedrooms/buongiorno/1.jpg",
    b: "/mega/bedrooms/buongiorno/2.jpg",
  },

  // ГОСТИНЫЕ
  [makeCollectionHref("scandi", "living")]: {
    title: "Гостиная «СКАНДИ»",
    main: "/mega/living/scandi/main.jpg",
    a: "/mega/living/scandi/1.jpg",
    b: "/mega/living/scandi/2.jpg",
  },
  [makeCollectionHref("pitti", "living")]: {
    title: "Гостиная «ПАТТИ»",
    main: "/mega/living/pitti/main.jpg",
    a: "/mega/living/pitti/1.jpg",
    b: "/mega/living/pitti/2.jpg",
  },
  [makeCollectionHref("salvador", "living")]: {
    title: "Гостиная «САЛЬВАДОР»",
    main: "/mega/living/salvador/main.jpg",
    a: "/mega/living/salvador/1.jpg",
    b: "/mega/living/salvador/2.jpg",
  },
  [makeCollectionHref("buongiorno", "living")]: {
    title: "Гостиная «BERGEN WHITE»",
    main: "/mega/living/buongiorno/main.jpg",
    a: "/mega/living/buongiorno/1.jpg",
    b: "/mega/living/buongiorno/2.jpg",
  },

  // МОЛОДЕЖНЫЕ
  [makeCollectionHref("scandi", "youth")]: {
    title: "Молодежная «СКАНДИ»",
    main: "/mega/youth/scandi/main.jpg",
    a: "/mega/youth/scandi/1.jpg",
    b: "/mega/youth/scandi/2.jpg",
  },
  [makeCollectionHref("elizabeth", "youth")]: {
    title: "Молодежная «ЭЛИЗАБЕТ»",
    main: "/mega/youth/elizabeth/main.jpg",
    a: "/mega/youth/elizabeth/1.jpg",
    b: "/mega/youth/elizabeth/2.jpg",
  },
};

/**
 * ✅ Маппинг: href коллекции -> id "товара-витрины"
 * Это позволит в /catalog/[slug] или в mega-menu сразу знать id товара,
 * чтобы ProductClient работал как обычный товар (корзина/избранное).
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
 * ✅ Если вдруг нужно: href -> {brand, category}
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
    label: "Узбекистан",
    phone: "+998 90 000-00-00",
    addresses: ["Rich House Мирзо-Улугбека, 18"],
    phonePrefix: "+998",
  },
  ru: {
    label: "Россия",
    phone: "+7 495 077-85-59",
    addresses: [
      "Москва, ул. Тверская, 12",
      "Москва, Ленинградский просп., 45",
      "Санкт-Петербург, Невский пр., 28",
    ],
    phonePrefix: "+7",
  },
} as const;
