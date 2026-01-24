// app/lib/mock/products.ts
import { CATALOG_MOCK } from "./catalog-products";

export type ProductMock = {
  id: string;
  title: string;
  href: string;
  image: string;
  sku?: string;
  badge?: string;
  price: {
    rub: number;
    uzs: number;
  };
};

export const PRODUCTS_MOCK: ProductMock[] = (CATALOG_MOCK as any[]).map((p) => {
  const id = String(p.id);

  return {
    id,
    title: String(p.title ?? ""),
    href: String(p.href ?? `/catalog?product=${id}`),
    image: String(p.image ?? ""),
    sku: p.sku ? String(p.sku) : (p.skuLabel ? String(p.skuLabel) : undefined),
    badge: p.badge ? String(p.badge) : undefined,
    price: {
      rub: Number(p.price_rub ?? 0),
      uzs: Number(p.price_uzs ?? 0),
    },
  };
});

export const byId = new Map<string, ProductMock>(
  PRODUCTS_MOCK.map((p) => [p.id, p]),
);
