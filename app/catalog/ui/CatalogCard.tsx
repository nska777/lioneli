"use client";

import Image from "next/image";
import Link from "next/link";

import ProductActions from "../ProductActions";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function CatalogCard({
  p,
  idx,
  fmtPrice,
}: {
  p: Record<string, any>;
  idx: number;
  fmtPrice: (rub: number, uzs: number) => string;
}) {
  const catalogPath =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/catalog";

  const href = `/product/${p.id}?from=${encodeURIComponent(catalogPath)}`;

  const snapshot = {
    title: p.title,
    href,
    imageUrl: p.image,
    sku: p.sku ? String(p.sku) : null,
    price_uzs: Number(p.price_uzs ?? p.priceUZS ?? 0),
    price_rub: Number(p.price_rub ?? p.priceRUB ?? 0),
  };

  return (
    <article
      data-card
      className="group h-full overflow-hidden rounded-2xl border border-black/10 bg-[#F7F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            priority={idx < 6}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />

          {p.badge ? (
            <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/80 px-3 py-1 text-[11px] text-black/70 backdrop-blur">
              {p.badge}
            </div>
          ) : null}

          <div className="absolute right-3 top-3 z-10 flex translate-y-[-6px] gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ProductActions
                id={String(p.id)}
                snapshot={snapshot}
                onOpenSpecs={() => {
                  window.location.href = href;
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {/* ✅ ЖЕЛЕЗНО: 2 строки, без line-clamp плагина */}
          <div
            className="text-[14px] font-medium leading-[22px] text-black/90 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical" as any,
              WebkitLineClamp: 2,
              maxHeight: 44, // 2 строки * 22px
            }}
          >
            {p.title}
          </div>

          <div className="mt-2 text-[15px] font-semibold text-black">
            {fmtPrice(
              Number(p.price_rub ?? p.priceRUB ?? 0),
              Number(p.price_uzs ?? p.priceUZS ?? 0),
            )}
          </div>

          {/* ✅ отступ от цены + кнопка всегда внизу */}
          <div className="mt-auto pt-4">
            <div
              className={cn(
                "h-10 w-full rounded-xl flex items-center justify-center",
                "text-[11px] tracking-[0.14em] uppercase text-white",
                "bg-black hover:bg-black/90 transition cursor-pointer",
              )}
            >
              Открыть
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
