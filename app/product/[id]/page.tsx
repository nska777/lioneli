import { notFound } from "next/navigation";
import ProductClient from "./ui/ProductClient";
import type { RelatedItem } from "./ui/ProductClient";

import { CATALOG_MOCK } from "@/app/lib/mock/catalog-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const all = (CATALOG_MOCK as any[]) ?? [];
  const p = all.find((x) => String(x.id) === String(id));
  if (!p) return notFound();

  const isHit = (x: any) =>
    String(x.badge || "")
      .toLowerCase()
      .includes("хит");

  // ✅ 2 товара "с этим покупают": берём хиты, исключая текущий
  const related: RelatedItem[] = all
    .filter((x) => String(x.id) !== String(id))
    .filter((x) => isHit(x))
    .slice(0, 2)
    .map((x) => ({
      id: String(x.id),
      title: x.title,
      badge: x.badge || "Хит",
      image: x.image,
      price_rub: Number(x.price_rub ?? 0),
      price_uzs: Number(x.price_uzs ?? 0),
      href: `/product/${x.id}`,
    }));

  // ✅ если у товара нет gallery/specs/variants — делаем премиальный fallback
  const gallery = (
    Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : [p.image, p.image, p.image, p.image]
  ).map(String);

  // ✅ ширина/высота (если нет в моках — поставим заглушки)
  const width = p.width ?? p.w ?? "—";
  const height = p.height ?? p.h ?? "—";

  const product = {
    id: String(p.id),
    title: p.title,
    badge: p.badge || "",
    href: `/product/${p.id}`,
    sku: p.sku || `MR${String(p.id).padStart(4, "0")}`,
    image: p.image,
    gallery,

    price_rub: Number(p.price_rub ?? 0),
    price_uzs: Number(p.price_uzs ?? 0),

    description:
      p.description ||
      "Стильный предмет мебели выполнен из качественных материалов. Идеально подходит для современного интерьера.",

    specs: (p.specs as Array<{ label: string; value: string }> | undefined) ?? [
      { label: "Материал", value: "Массив / МДФ" },
      { label: "Цвет", value: "Шампань / Орех" },
      { label: "Гарантия", value: "24 месяца" },
      { label: "Сборка", value: "Требуется" },
      { label: "Ширина", value: String(width) },
      { label: "Высота", value: String(height) },
    ],

    variants: (p.variants as Array<{
      label: string;
      swatch: string;
      id?: string;
    }>) ?? [
      { label: "Орех", swatch: "#7a5a3a" },
      { label: "Шампань", swatch: "#cbb9a4" },
      { label: "Графит", swatch: "#2f3136" },
      { label: "Дуб", swatch: "#b0865a" },
      { label: "Серый", swatch: "#8d9096" },
      { label: "Белый", swatch: "#e9e9e9" },
    ],
  };

  return <ProductClient product={product} related={related} />;
}
