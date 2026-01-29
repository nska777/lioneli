import { notFound } from "next/navigation";
import ProductClient from "./ui/ProductClient";

// ✅ единый источник правды (моки каталога)
import { BRANDS, CATALOG_MOCK } from "@/app/lib/mock/catalog-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = (CATALOG_MOCK as any[]).find((x) => String(x.id) === String(id));
  if (!p) return notFound();

  // ✅ нормализуем галерею (база)
  const galleryBase = (
    Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : [p.image, p.image, p.image, p.image]
  )
    .map(String)
    .filter(Boolean);

  // ✅ нормализуем variants (если есть)
  const variants = Array.isArray(p.variants)
    ? (p.variants as any[])
        .map((v) => ({
          id: String(v?.id ?? ""),
          title: String(v?.title ?? ""),
          kind: v?.kind === "color" || v?.kind === "option" ? v.kind : "option",
          priceDeltaRUB:
            v?.priceDeltaRUB !== undefined
              ? Number(v.priceDeltaRUB)
              : undefined,
          priceDeltaUZS:
            v?.priceDeltaUZS !== undefined
              ? Number(v.priceDeltaUZS)
              : undefined,
          image: v?.image ? String(v.image) : undefined,
          gallery: Array.isArray(v?.gallery)
            ? v.gallery.map(String).filter(Boolean)
            : undefined,
        }))
        .filter((v) => v.id && v.title)
    : [];

  // ✅ коллекция (бренд)
  const brandSlug = String(p.brand ?? "")
    .trim()
    .toLowerCase();
  const brandLabel =
    BRANDS.find((b) => String(b.slug).toLowerCase() === brandSlug)?.title ??
    (brandSlug ? brandSlug.toUpperCase() : "");

  const product = {
    id: String(p.id),
    title: p.title,
    badge: p.badge || "",
    href: p.href || `/product/${p.id}`,
    sku: p.sku || `T${String(p.id).padStart(4, "0")}`, // как "T0662"
    image: String(p.image || ""),
    gallery: galleryBase,
    price_rub: Number(p.price_rub ?? p.priceRUB ?? 0),
    price_uzs: Number(p.price_uzs ?? p.priceUZS ?? 0),

    // ✅ ВАЖНО: прокидываем варианты
    variants,

    // ✅ ВАЖНО: прокидываем коллекцию (чтобы в UI писать SCANDI)
    brand: brandSlug, // "scandi"
    collectionLabel: brandLabel, // "SCANDI"

    // Блок "Описание"
    description:
      p.description ||
      "Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы.",

    // Блок "Дополнительная информация"
    extra: {
      article: p.sku || `T${String(p.id).padStart(4, "0")}`,
      size: p.size || "500 × 450 × 523",
      color: p.color || "орех матовый / мокко",
      material: p.material || "мдф, шпон ясень, массив ясень",
    },

    // “С этим товаром покупают” — возьмём 4 товара
    related: (CATALOG_MOCK as any[])
      .filter((x) => String(x.id) !== String(p.id))
      .slice(0, 4)
      .map((x) => ({
        id: String(x.id),
        title: x.title,
        image: x.image,
        price_rub: Number(x.price_rub ?? x.priceRUB ?? 0),
        price_uzs: Number(x.price_uzs ?? x.priceUZS ?? 0),
        href: `/product/${x.id}`,
        badge: x.badge || "",
      })),
  };

  return <ProductClient product={product} />;
}
