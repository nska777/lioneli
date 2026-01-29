"use client";

import CatalogCard from "./CatalogCard";

export default function CatalogGrid({
  gridRef,
  items,
  fmtPrice,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  items: Array<Record<string, any>>;
  fmtPrice: (rub: number, uzs: number) => string;
}) {
  return (
    <div
      ref={gridRef}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch [grid-auto-rows:1fr]"
    >
      {items.map((p, idx) => (
        <CatalogCard key={String(p.id)} p={p} idx={idx} fmtPrice={fmtPrice} />
      ))}
    </div>
  );
}
