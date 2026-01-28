// app/lib/mock/catalog-base.ts
// ✅ общие типы + хелперы для сборки моков

export type BrandItem = { title: string; slug: string };
export type CatItem = { title: string; slug: string };

// ✅ Варианты товара (цвет / опция)
export type CatalogVariant = {
  id: string;
  title: string;
  kind: "color" | "option";
  priceDeltaRUB?: number;
  priceDeltaUZS?: number;
  image?: string;
  gallery?: string[];
};

export type CatalogProduct = {
  id: string;
  title: string;

  // фильтры
  brand: string; // slug из BRANDS
  cat: string; // slug из CATS

  // ✅ алиасы для совместимости с разным UI
  category?: string; // часто ждут p.category
  collectionKey?: string; // /collection/[key] ждёт p.collectionKey

  // UI
  badge?: string;
  sku?: string;
  href?: string;

  // картинки
  image: string;
  gallery?: string[];

  // цены
  priceRUB: number;
  priceUZS: number;

  // варианты
  variants?: CatalogVariant[];

  // совместимость со старым snake_case
  price_rub?: number;
  price_uzs?: number;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export function makeGallery(basePath: string, count: number) {
  return Array.from({ length: count }, (_, i) => `${basePath}/${pad2(i + 1)}.jpg`);
}

export function makeProduct(
  p: Omit<CatalogProduct, "image" | "price_rub" | "price_uzs" | "category"> & {
    basePath: string;
    coverIndex?: number;
    collectionKey?: string;
  },
) {
  const cover = pad2(p.coverIndex ?? 1);

  const priceRUB = Number(p.priceRUB ?? 0) || 0;
  const priceUZS = Number(p.priceUZS ?? 0) || 0;

  const product: CatalogProduct = {
    id: p.id,
    title: p.title,
    brand: p.brand,
    cat: p.cat,

    // ✅ алиасы
    category: p.cat,
    collectionKey: p.collectionKey ?? p.brand,

    badge: p.badge ?? "",
    sku: p.sku ?? "",
    href: p.href ?? `/product/${p.id}`,

    image: `${p.basePath}/${cover}.jpg`,
    gallery: p.gallery ?? [],

    priceRUB,
    priceUZS,
    variants: Array.isArray(p.variants) ? p.variants : undefined,

    // ✅ совместимость
    price_rub: priceRUB,
    price_uzs: priceUZS,
  };

  return product;
}
