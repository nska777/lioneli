import { notFound } from "next/navigation";
import ProductClient from "./ui/ProductClient";

// ✅ единый источник правды (моки каталога)
import { CATALOG_MOCK } from "@/app/lib/mock/catalog-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = (CATALOG_MOCK as any[]).find((x) => String(x.id) === String(id));
  if (!p) return notFound();

  // ✅ нормализуем под UI 1-в-1
  const gallery = (
    Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : [p.image, p.image, p.image, p.image]
  ).map(String);

  const product = {
    id: String(p.id),
    title: p.title,
    badge: p.badge || "",
    href: p.href || `/product/${p.id}`,
    sku: p.sku || `T${String(p.id).padStart(4, "0")}`, // как "T0662"
    image: p.image,
    gallery,
    price_rub: Number(p.price_rub ?? 0),
    price_uzs: Number(p.price_uzs ?? 0),

    // Блок "Описание"
    description:
      p.description ||
      "Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы. Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы. Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы. Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы. Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы. Компактная и практичная модель. Удобная тумба с выдвижными ящиками. Для изготовления используются качественные материалы.",

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
        price_rub: Number(x.price_rub ?? 0),
        price_uzs: Number(x.price_uzs ?? 0),
        href: `/product/${x.id}`,
        badge: x.badge || "",
      })),
  };

  return <ProductClient product={product} />;
}
