// app/lib/mock/catalog-products.ts
// ✅ Тонкий сборщик: BRANDS / CATS / COLLECTION_PRODUCTS / CATALOG_MOCK / CATALOG_BY_ID
// ✅ + DEV-защита: лог дублей id (чтобы не было "кровать из SCANDI везде")

export type { BrandItem, CatItem, CatalogVariant, CatalogProduct } from "./catalog-base";
import type { BrandItem, CatItem, CatalogProduct } from "./catalog-base";

import {
  SCANDI_PRODUCTS,
  SALVADOR_PRODUCTS,
  PITTI_PRODUCTS,
  ELIZABETH_PRODUCTS,
  BUONGIORNO_PRODUCTS,
  AMBER_PRODUCTS,
} from "./collections-data";

// ✅ коллекции (бренды/серии)
export const BRANDS: BrandItem[] = [
  { title: "AMBER", slug: "amber" },
  { title: "BUONGIORNO", slug: "buongiorno" },
  { title: "ELIZABETH", slug: "elizabeth" },
  { title: "PITTI", slug: "pitti" },
  { title: "SALVADOR", slug: "salvador" },
  { title: "SCANDI", slug: "scandi" },
];

// ✅ категории/модули
// ⚠️ Важно: slug должен 1-в-1 совпадать с путями в public
export const CATS: CatItem[] = [
  { title: "Фасады", slug: "fasadi" },
  { title: "Комоды", slug: "komody" },
  { title: "Кровати", slug: "krovati" },
  { title: "Плинтусы", slug: "plintusy" }, // ✅ добавили под SALVADOR
  { title: "Полки", slug: "polki" },
  { title: "Шкафы", slug: "shkafy" },
  { title: "Стеллажи", slug: "stellaji" },
  { title: "Столы", slug: "stoli" },

  // ⚠️ сейчас slug = "tumby"
  // если у AMBER папка/моки "tumbi" — товары AMBER могут "исчезать" при фильтре по категории
  { title: "Тумбы", slug: "tumby" },

  { title: "Вешалки", slug: "veshalki" },
  { title: "Витрины", slug: "vitrini" },
  { title: "Зеркала", slug: "zerkala" },
  { title: "Пуфы", slug: "pufi" },
];

// ✅ список коллекций для /collection/[key]
export type CollectionItem = { id: string; title: string };
export const COLLECTION_PRODUCTS: CollectionItem[] = BRANDS.map((b) => ({
  id: b.slug,
  title: b.title,
}));

// ✅ Единый источник правды для каталога
export const CATALOG_MOCK: CatalogProduct[] = [
  ...SCANDI_PRODUCTS,
  ...SALVADOR_PRODUCTS,
  ...PITTI_PRODUCTS,
  ...ELIZABETH_PRODUCTS,
  ...BUONGIORNO_PRODUCTS,
  ...AMBER_PRODUCTS,

  // 🔻 дальше ты добавляешь новые коллекции так же:
  // ...NEW_PRODUCTS,
];

// ✅ DEV: проверка дублей id (чтобы не ловить "товар из другой коллекции")
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  const dups: string[] = [];

  for (const p of CATALOG_MOCK) {
    const id = String(p.id);
    if (seen.has(id)) dups.push(id);
    else seen.add(id);
  }

  if (dups.length) {
    // eslint-disable-next-line no-console
    console.error("❌ DUPLICATE PRODUCT IDs in CATALOG_MOCK:", dups);
  }
}

// ✅ быстрый доступ к товару по id: Map (чтобы работал .get())
// ⚠️ если id дублируются — Map перезапишет старый товар новым (поэтому выше лог дублей)
export const CATALOG_BY_ID = new Map<string, CatalogProduct>(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
);

// ✅ запасной вариант: Object-словарь (если где-то было CATALOG_BY_ID[id])
export const CATALOG_BY_ID_OBJ = Object.fromEntries(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
) as Record<string, CatalogProduct>;
