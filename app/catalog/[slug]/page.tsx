import { notFound } from "next/navigation";
import ProductClient from "@/app/product/[id]/ui/ProductClient";

import { megaCategories, MEGA_PREVIEWS } from "@/app/lib/headerData";
import { CATALOG_MOCK, CATALOG_BY_ID } from "@/app/lib/mock/catalog-products"; // ✅ добавили CATALOG_BY_ID

function titleCase(s: string) {
  if (!s) return s;
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function parseCollectionSlug(slug: string) {
  const m = slug?.match(/^collection-([a-z0-9-]+)-([a-z0-9-]+)$/i);
  if (!m) return null;
  return { brand: m[1], category: m[2] };
}

export default async function CatalogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return notFound();

  const href = `/catalog/${slug}`;
  const parsed = parseCollectionSlug(slug);
  if (!parsed) return notFound();

  const found = megaCategories
    .flatMap((c) => c.items.map((it) => ({ cat: c, it })))
    .find((x) => x.it.href === href);

  const categoryLabel =
    found?.cat.label ?? titleCase(parsed.category ?? "Категория");
  const collectionLabel =
    found?.it.label ?? titleCase(parsed.brand ?? "Коллекция");

  const preview = MEGA_PREVIEWS[href];

  const products = (CATALOG_MOCK as any[]).filter(
    (p) => p.brand === parsed.brand && p.category === parsed.category,
  );

  if (!products.length) return notFound();

  const collectionId = `col-${parsed.brand}-${parsed.category}`;

  // ✅ ВАЖНО: цену берем из витрины (COLLECTION_PRODUCTS уже лежит в CATALOG_BY_ID)
  const showcase = CATALOG_BY_ID.get(collectionId) as any;

  const price_uzs =
    Number(showcase?.price_uzs ?? 0) ||
    Math.min(...products.map((x) => Number(x.price_uzs ?? 0)));

  const price_rub =
    Number(showcase?.price_rub ?? 0) ||
    Math.min(...products.map((x) => Number(x.price_rub ?? 0)));

  const gallery = [preview?.main, preview?.a, preview?.b, products[0]?.image]
    .filter(Boolean)
    .map(String);

  const product = {
    id: collectionId,
    title: preview?.title ?? `Коллекция «${collectionLabel}»`,
    badge: "Коллекция",
    href,
    sku: collectionId.toUpperCase(),
    image: preview?.main || products[0].image,
    gallery: gallery.length ? gallery : [products[0].image],

    price_rub,
    price_uzs,

    description:
      "Это витрина коллекции. Вы можете добавить коллекцию в корзину как единый товар, либо открыть конкретный товар ниже и посмотреть характеристики.",

    extra: {
      article: collectionId.toUpperCase(),
      size: "—",
      color: "—",
      material: "—",
    },

    related: products.slice(0, 12).map((x) => ({
      id: String(x.id),
      title: x.title,
      image: x.image,
      price_rub: Number(x.price_rub ?? 0),
      price_uzs: Number(x.price_uzs ?? 0),
      href: `/product/${x.id}`,
      badge: x.badge || "",
    })),

    brand: parsed.brand,
    category: parsed.category,
    collectionHref: href,
    categoryLabel,
    collectionLabel,
    collectionPreview: preview,

    isCollection: true,
  };

  return <ProductClient product={product as any} />;
}
