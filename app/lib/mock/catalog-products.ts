// app/lib/mock/catalog-products.ts
// ✅ Тонкий сборщик: BRANDS / CATS / COLLECTION_PRODUCTS / CATALOG_MOCK / CATALOG_BY_ID

export type { BrandItem, CatItem, CatalogVariant, CatalogProduct } from "./catalog-base";
import type { BrandItem, CatItem, CatalogProduct } from "./catalog-base";

import { SCANDI_PRODUCTS, SALVADOR_PRODUCTS, PITTI_PRODUCTS, ELIZABETH_PRODUCTS, BUONGIORNO_PRODUCTS, AMBER_PRODUCTS,} from "./collections-data";

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
export const CATS: CatItem[] = [
  { title: "Фасады", slug: "fasadi" },
  { title: "Комоды", slug: "komody" },
  { title: "Кровати", slug: "krovati" },
  { title: "Плинтусы", slug: "plintusy" }, // ✅ добавили под SALVADOR
  { title: "Полки", slug: "polki" },
  { title: "Шкафы", slug: "shkafy" },
  { title: "Стеллажи", slug: "stellaji" },
  { title: "Столы", slug: "stoli" },
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
  // ...AMBER_PRODUCTS,
  // ...PITTI_PRODUCTS,
];

// ✅ быстрый доступ к товару по id: Map (чтобы работал .get())
export const CATALOG_BY_ID = new Map<string, CatalogProduct>(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
);

// ✅ запасной вариант: Object-словарь (если где-то было CATALOG_BY_ID[id])
export const CATALOG_BY_ID_OBJ = Object.fromEntries(
  CATALOG_MOCK.map((p) => [String(p.id), p]),
) as Record<string, CatalogProduct>;
