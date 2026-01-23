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

export const megaCategories: MegaCategory[] = [
  {
    key: "bedrooms",
    label: "СПАЛЬНИ",
    href: "/category/bedrooms",
    items: [
      { label: "АМБЕР", href: "/catalog/collection-amber-bedrooms" },
      { label: "СКАНДИ", href: "/catalog/collection-scandi-bedrooms" },
      { label: "ЭЛИЗАБЕТ", href: "/catalog/collection-elizabeth-bedrooms" },
      { label: "САЛЬВАДОР", href: "/catalog/collection-salvador-bedrooms" },
      { label: "ПИТТИ", href: "/catalog/collection-pitti-bedrooms" },
      { label: "БОНЖОРНО", href: "/catalog/collection-buongiorno-bedrooms" },
    ],
  },
  {
    key: "living",
    label: "ГОСТИНЫЕ",
    href: "/category/living",
    items: [
      { label: "СКАНДИ", href: "/catalog/collection-scandi-living" },
      { label: "ПАТТИ", href: "/catalog/collection-pitti-living" },
      { label: "САЛЬВАДОР", href: "/catalog/collection-salvador-living" },
      { label: "BERGEN WHITE", href: "/catalog/collection-buongiorno-living" },
    ],
  },
  {
    key: "hallway",
    label: "МОЛОДЕЖНЫЕ",
    href: "/category/youth",
    items: [
      { label: "СКАНДИ", href: "/catalog/collection-scandi-youth" },
      { label: "ЭЛИЗАБЕТ", href: "/catalog/collection-elizabeth-youth" },
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
   Пока ссылки можешь не активировать в UI — это просто данные.
   Картинки клад в /public/mega/...
========================= */

export type MegaPreview = {
  title: string; // подпись на большой фотке
  main: string; // большая
  a: string; // маленькая 1
  b: string; // маленькая 2
};

export const MEGA_PREVIEWS: Record<string, MegaPreview> = {
  // СПАЛЬНИ
  "/catalog/collection-amber-bedrooms": {
    title: "Спальня «АМБЕР»",
    main: "/mega/bedrooms/amber/main.jpg",
    a: "/mega/bedrooms/amber/1.jpg",
    b: "/mega/bedrooms/amber/2.jpg",
  },
  "/catalog/collection-scandi-bedrooms": {
    title: "Спальня «СКАНДИ»",
    main: "/mega/bedrooms/scandi/main.jpg",
    a: "/mega/bedrooms/scandi/1.jpg",
    b: "/mega/bedrooms/scandi/2.jpg",
  },
  "/catalog/collection-elizabeth-bedrooms": {
    title: "Спальня «ЭЛИЗАБЕТ»",
    main: "/mega/bedrooms/elizabeth/main.jpg",
    a: "/mega/bedrooms/elizabeth/1.jpg",
    b: "/mega/bedrooms/elizabeth/2.jpg",
  },
  "/catalog/collection-salvador-bedrooms": {
    title: "Спальня «САЛЬВАДОР»",
    main: "/mega/bedrooms/salvador/main.jpg",
    a: "/mega/bedrooms/salvador/1.jpg",
    b: "/mega/bedrooms/salvador/2.jpg",
  },
  "/catalog/collection-pitti-bedrooms": {
    title: "Спальня «ПИТТИ»",
    main: "/mega/bedrooms/pitti/main.jpg",
    a: "/mega/bedrooms/pitti/1.jpg",
    b: "/mega/bedrooms/pitti/2.jpg",
  },
  "/catalog/collection-buongiorno-bedrooms": {
    title: "Спальня «БОНЖОРНО»",
    main: "/mega/bedrooms/buongiorno/main.jpg",
    a: "/mega/bedrooms/buongiorno/1.jpg",
    b: "/mega/bedrooms/buongiorno/2.jpg",
  },

  // ГОСТИНЫЕ (поставил структуру — просто добавь фотки)
  "/catalog/collection-scandi-living": {
    title: "Гостиная «СКАНДИ»",
    main: "/mega/living/scandi/main.jpg",
    a: "/mega/living/scandi/1.jpg",
    b: "/mega/living/scandi/2.jpg",
  },
  "/catalog/collection-pitti-living": {
    title: "Гостиная «ПАТТИ»",
    main: "/mega/living/pitti/main.jpg",
    a: "/mega/living/pitti/1.jpg",
    b: "/mega/living/pitti/2.jpg",
  },
  "/catalog/collection-salvador-living": {
    title: "Гостиная «САЛЬВАДОР»",
    main: "/mega/living/salvador/main.jpg",
    a: "/mega/living/salvador/1.jpg",
    b: "/mega/living/salvador/2.jpg",
  },
  "/catalog/collection-buongiorno-living": {
    title: "Гостиная «BERGEN WHITE»",
    main: "/mega/living/buongiorno/main.jpg",
    a: "/mega/living/buongiorno/1.jpg",
    b: "/mega/living/buongiorno/2.jpg",
  },

  // МОЛОДЕЖНЫЕ (заготовка)
  "/catalog/collection-scandi-youth": {
    title: "Молодежная «СКАНДИ»",
    main: "/mega/youth/scandi/main.jpg",
    a: "/mega/youth/scandi/1.jpg",
    b: "/mega/youth/scandi/2.jpg",
  },
  "/catalog/collection-elizabeth-youth": {
    title: "Молодежная «ЭЛИЗАБЕТ»",
    main: "/mega/youth/elizabeth/main.jpg",
    a: "/mega/youth/elizabeth/1.jpg",
    b: "/mega/youth/elizabeth/2.jpg",
  },
};

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
